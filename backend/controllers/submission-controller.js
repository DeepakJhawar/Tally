import { Semaphore } from 'async-mutex';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import ContestSubmissions from "../models/contest-submissions-model.js";
import Submission from "../models/submission-model.js"
import SaveCode from "../models/save-code-model.js"
import TestCase from "../models/testcase-model.js"
import Problem from "../models/problem-model.js"
import User from "../models/user.js"
import ContestQuestions from '../models/contest-problems-model.js';
import Contest from '../models/contest-model.js';
import { getSocketInstance } from '../sockets-initializer.js';

const execPromise = util.promisify(exec);

const semaphore = new Semaphore(process.env.MAX_CONCURRENT_PROCESSES);

const _runCode = async (language, code, input, expectedOutput) => {
    // Wait for a free slot in the semaphore
    const [value, release] = await semaphore.acquire();
    const uniqueId = uuidv4();
    let executable = `tempCode_${uniqueId}`;
    const extension = getFileExtension(language);
    const fileName = `${executable}.${extension}`;
    const inputFile = `${executable}.txt`;

    try {
        // Determine the Docker image to use based on the language
        const imageName = getDockerImageName(language);
        if (!imageName) {
            throw new Error('Unsupported language');
        }

        // Create a temp file to hold the code
        await fs.writeFile(fileName, code);
        await fs.writeFile(inputFile, input);

        // Construct the Docker run command
        // -v "${process.cwd()}:/usr/src/app:ro"      
        const command = `docker run --rm -e EXECUTABLE="${executable}" \
        -v "${process.cwd()}/${executable}.txt:/usr/src/app/${executable}.txt:ro" \
        -v "${process.cwd()}/${fileName}:/usr/src/app/${fileName}:ro" \
        --memory="256m" --memory-swap="500m" --cpus="1.0" ${imageName}`;

        const timeout = 3000; // 3 seconds
        const execPromiseWithTimeout = (cmd) => {
            return Promise.race([
                execPromise(cmd),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]);
        };

        // Execute the command
        const { stdout, stderr } = await execPromiseWithTimeout(command);
        if (stderr.includes('timeout')) {
            return {
                status: 'Failed',
                message: 'Time limit exceeded',
                output: 'Time limit exceeded'
            }
        }

        // Compare output to expected output
        let passed = true;
        if (expectedOutput) {
            if (typeof expectedOutput === 'string') {
                // If expectedOutput is a string, compare it directly with stdout
                passed = stdout.trim() === expectedOutput.trim();
            } else if (Array.isArray(expectedOutput)) {
                // If expectedOutput is a list of strings, check if stdout is in that list
                passed = expectedOutput.some(output => stdout.trim() === output.trim());
            }
        }

        return {
            status: passed ? 'Passed' : 'Failed',
            output: stdout.trim(),
            expectedOutput: expectedOutput ? expectedOutput.trim() : null,
            testCases: input,
            message: passed ? "sucessful" : "wrong"
        };
    } catch (error) {
        if (error.stderr && error.stderr.includes("Killed")) {
            return {
                status: 'Failed',
                message: 'Memory limit exceeded',
                output: 'Memory limit exceeded'
            };
        }
        if (error.stderr && error.stderr.includes("timeout")) {
            return {
                status: 'Failed',
                message: 'Time limit exceeded',
                output: 'Time limit exceeded'
            };
        }

        let message = error.stderr || error.message;
        const workingdirRegex = new RegExp("/usr/src/app/", 'g');
        const filenameRegex = new RegExp(fileName, 'g');
        message = message.replace(filenameRegex, `<main.${extension}>`);
        message = message.replace(workingdirRegex, "");
        return {
            status: 'Failed',
            message: message,
            output: message
        };
    } finally {
        release(); // Release the semaphore slot

        // Clean up the temp file
        try {
            await fs.unlink(executable);
        } catch { }
        try {
            await fs.unlink(inputFile);
        } catch { }
        try {
            await fs.unlink(fileName);
        } catch { }
    }
}

const updateSolvedProblems = async (user_id, problemData) => {
    try {
        const user = await User.findById(user_id);
        const problemNumber = problemData.problemNumber;
        if (user) {
            if (!user.solved || !user.solved.hasOwnProperty(problemNumber)) {
                user.solved = {
                    ...user.solved, [problemNumber]: problemData.difficulty
                };
                await user.save();
            }
        }
    } catch (err) {
        console.error(err);
    }
}

const submitCode = async (req, res) => {
    try {
        const user_id = req.user.user._id;
        let { language, code, problemNumber } = req.body;
        code = atob(code);

        // Validate the input
        if (!language || !code || !problemNumber) {
            return res.status(400).json({
                status: "Failed",
                message: "All fields are required: language, code, problemNumber",
                output: "All fields are required: language, code, problemNumber"
            });
        }

        const problemData = await Problem.findOne({ problemNumber }).exec();
        const testCaseId = problemData.testCaseId;

        const testCaseData = await TestCase.findOne({ _id: testCaseId });
        if (!testCaseData) {
            return res.status(400).json({
                status: "Failed",
                message: "Test case not found",
                output: "Test case not found"
            });
        }

        await SaveCode.findOneAndUpdate(
            { user: user_id, problem: problemNumber, language: language },
            {
                code: code,
                savedAt: Date.now()  // Update the savedAt field with the current date and time
            },
            {
                new: true,
                upsert: true,
            }
        );

        const testCases = testCaseData.givenInput.map((input, index) => ({
            input,
            expectedOutput: testCaseData.correctOutput[index]
        }));
        for (const [index, { input, expectedOutput }] of testCases.entries()) {
            const response = await _runCode(language, code, input, expectedOutput);
            if (response.status == "Failed") {
                let verdict = "";
                if (response.message.toLowerCase().includes("timeout")) {
                    verdict = "TIME LIMIT EXCEEDED";
                } else if (response.message.toLowerCase().includes("memory limit exceeded")) {
                    verdict = "MEMORY LIMIT EXCEEDED";
                } else if (response.message.toLowerCase().includes("wrong")) {
                    verdict = "WRONG ANSWER";
                } else {
                    verdict = "ERROR";
                }

                if (verdict != "ERROR") {
                    const newSubmission = new Submission(
                        { user: user_id, problem: problemNumber, code: code, language: language, verdict: verdict }
                    );
                    await newSubmission.save();
                }
                return res.status(200).json({ ...response, passed: `${index}/${testCases.length}`, input, expectedOutput })
            }
        }

        const newSubmission = new Submission({
            user: user_id,
            problem: problemNumber,
            code: code,
            language: language,
            verdict: "ACCEPTED"
        });
        await newSubmission.save();

        await updateSolvedProblems(user_id, problemData)

        res.status(200).json({ status: "Passed", message: "All testcases passed.", passed: `${testCases.length}/${testCases.length}` })
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Failed", message: "Internal Server Error", passed: `0/0` })
    }
};

const submitContestCode = async (req, res) => {
    try {
        const io = getSocketInstance();
        const user_id = req.user.user._id;
        let { language, code, problemNumber, contestId } = req.body;
        code = atob(code);

        // Validate the input
        if (!language || !code || !problemNumber || !contestId) {
            return res.status(400).json({
                status: "Failed",
                message: "All fields are required: language, code, problemNumber, contestId",
                output: "All fields are required: language, code, problemNumber, contestId"
            });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(400).json({
                status: "Failed",
                message: "Contest not found",
                output: "Contest not found"
            });
        }

        if (contest.schedule.start > new Date()) {
            return res.status(400).json({
                status: "Failed",
                message: "Contest not started yet",
                output: "Contest not started yet"
            });
        }

        if (contest.participants.every(participant => !participant.user.equals(user_id))) {
            return res.status(400).json({
                status: "Failed",
                message: "User not registered for the contest",
                output: "User not registered for the contest"
            });
        }

        const problemData = await ContestQuestions.findOne({ _id: problemNumber, contestId });
        const testCaseId = problemData.testCaseId;

        const testCaseData = await TestCase.findOne({ _id: testCaseId });
        if (!testCaseData) {
            return res.status(400).json({
                status: "Failed",
                message: "Test case not found",
                output: "Test case not found"
            });
        }

        const testCases = testCaseData.givenInput.map((input, index) => ({
            input,
            expectedOutput: testCaseData.correctOutput[index]
        }));

        const contestSubmission = await ContestSubmissions.find({
            user: user_id,
            problemNumber: problemData.problemNumber,
            contestId,
            verdict: "ACCEPTED"
        });
        for (const [index, { input, expectedOutput }] of testCases.entries()) {
            const response = await _runCode(language, code, input, expectedOutput);
            if (response.status == "Failed") {
                let verdict = "";
                if (response.message.toLowerCase().includes("timeout")) {
                    verdict = "TIME LIMIT EXCEEDED";
                } else if (response.message.toLowerCase().includes("memory limit exceeded")) {
                    verdict = "MEMORY LIMIT EXCEEDED";
                } else if (response.message.toLowerCase().includes("wrong")) {
                    verdict = "WRONG ANSWER";
                } else {
                    verdict = "ERROR";
                }
                if (verdict != "ERROR") {
                    const newSubmission = new ContestSubmissions(
                        {
                            user: user_id, problemNumber: problemData.problemNumber, code: code, language: language, contestId, verdict
                        }
                    )
                    await newSubmission.save();

                    const negativePoints = problemData.points.negative;
                    const participant = contest.participants.find(participant => participant.user.equals(user_id));

                    if (contestSubmission.length == 0) {
                        if (participant) {
                            participant.score -= negativePoints;
                            contest.markModified('participants');
                            await contest.save();  // Save the updated contest only once after modifying the score

                            io.to(contestId).emit('updateLeaderboard', "update");
                        }
                    }
                }
                return res.status(200).json({ ...response, passed: `${index}/${testCases.length}`, input, expectedOutput })
            }
        }

        const newSubmission = new ContestSubmissions(
            {
                user: user_id, problemNumber: problemData.problemNumber, code: code, language: language, contestId, verdict: "ACCEPTED"
            }
        )
        await newSubmission.save();

        if (contestSubmission.length == 0) {
            const positivePoints = problemData.points.positive;
            const participant = contest.participants.find(participant => participant.user.equals(user_id));
            if (participant) {
                participant.score += positivePoints;
                participant.lastSubmission = Date.now()
                contest.markModified('participants');
                await contest.save();  // Save the updated contest only once after modifying the score
                io.to(contestId).emit('updateLeaderboard', "update");
            }
        }

        res.status(200).json({ status: "Passed", message: "All testcases passed.", passed: `${testCases.length}/${testCases.length}` })
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Failed", message: "Internal Server Error.", passed: `0/0` })
    }
}

const runCode = async (req, res) => {
    try {

        let { language, code, input, expectedOutput, problemNumber, contestId } = req.body;
        code = atob(code);
        input = atob(input)
        if (req.user && req.user.user && problemNumber && !contestId) {
            await SaveCode.findOneAndUpdate(
                { user: req.user.user._id, problem: problemNumber, language: language },
                {
                    code: code,
                    savedAt: Date.now()  // Update the savedAt field with the current date and time
                },
                {
                    new: true,
                    upsert: true,
                }
            );
        }

        const response = await _runCode(language, code, input, expectedOutput);
        if (response.status == "failed") {
            return res.status(400).json(response)
        }
        res.status(200).json(response)
    } catch (err) {
        console.error(err);
    }
};

const getDockerImageName = (language) => {
    switch (language) {
        case 'python':
            return 'code-judge-python';
        case 'javascript':
            return 'code-judge-nodejs';
        case 'cpp':
            return 'code-judge-cpp';
        case 'c':
            return 'code-judge-c';
        default:
            return null;
    }
};

const getFileExtension = (language) => {
    switch (language) {
        case 'python':
            return 'py';
        case 'javascript':
            return 'js';
        case 'cpp':
            return 'cpp';
        case 'c':
            return 'c';
        default:
            return '';
    }
};

const getSubmissions = async (req, res) => {
    try {
        let { problemNumber, contestId } = req.query;
        if (!problemNumber) {
            return res.status(400).json({ status: "unsucessful", data: "problemNumber is required" });
        }
        const user_id = req.user.user._id;
        let submissions;
        if (contestId) {
            const problemData = await ContestQuestions.findById(problemNumber);
            if (!problemData) {
                return res.status(200).json({ status: "unsucessful", data: "ProblemNumber not exists" });
            }
            problemNumber = problemData.problemNumber;
            submissions = await ContestSubmissions.find({ user: user_id, problemNumber, contestId }).sort({ submittedAt: -1 });
        }
        else {
            submissions = await Submission.find({ user: user_id, problem: problemNumber }).sort({ submittedAt: -1 });
        }
        res.status(200).json({ status: "ok", data: submissions });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ status: "unsucessful", data: "Internal Server Error" });
    }
}

export { submitCode, runCode, getSubmissions, submitContestCode };

