import { exec } from 'child_process';
import { promises as fs } from 'fs';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import Submission from "../models/submission-model.js"
import TestCase from "../models/testcase-model.js"
import Problem from "../models/problem-model.js"

const execPromise = util.promisify(exec);

const _runCode = async (language, code, input, expectedOutput) => {
    const uniqueId = uuidv4();
    const executable = `tempCode_${uniqueId}`;
    const fileName = `${executable}.${getFileExtension(language)}`;
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
        const command = `docker run --rm -e EXECUTABLE="${executable}" -v "${process.cwd()}:/usr/src/app" --memory="256m" --memory-swap="500m" --cpus="1.0" ${imageName}`;

        const timeout = 30000; // 30 seconds
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
                status: 'failed',
                message: "timeout",
            }
        }

        // Compare output to expected output
        let passed = true;
        if (expectedOutput) {
            passed = stdout.trim() === expectedOutput.trim();
        }

        return {
            status: passed ? 'passed' : 'failed',
            output: stdout.trim(),
            expectedOutput: expectedOutput ? expectedOutput.trim() : null,
            testCases: input,
            message: passed ? "sucessful" : "wrong"
        };
    } catch (error) {
        if (error.stderr && error.stderr.includes("Killed")) {
            return {
                status: 'failed',
                message: 'Memory limit exceeded',
            };
        }

        return {
            status: 'failed',
            error: error.stderr || error.message,
        };
    } finally {
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

const submitCode = async (req, res) => {
    let { language, code, problemNumber } = req.body;
    code = atob(code);

    if (req.session && req.session.user && req.session.user._id) {
        return res.status(400).json({
            status: "failed",
            message: "User login required."
        });
    }

    // Validate the input
    if (!language || !code || !problemNumber) {
        return res.status(400).json({
            status: "failed",
            message: "All fields are required: language, code, problemNumber"
        });
    }

    const problemData = await Problem.findOne({ problemNumber }).exec();
    const testCaseId = problemData.testCaseId;

    const testCaseData = await TestCase.findOne({ _id: testCaseId });
    if (!testCaseData) {
        return res.status(400).json({
            status: "failed",
            message: "Test case not found"
        });
    }

    const testCases = testCaseData.givenInput.map((input, index) => ({
        input,
        expectedOutput: testCaseData.correctOutput[index]
    }));

    for (const [index, { input, expectedOutput }] of testCases.entries()) {
        const response = await _runCode(language, code, input, expectedOutput);
        if (response.status == "failed") {
            let verdict = "";
            if (response.message == "timeout") {
                verdict = "TIMELIMITED ERROR";
            } else if (response.message == "Memory limit exceeded") {
                verdict = "MEMORY ERROR";
            } else if (response.message == "wrong") {
                verdict = "WRONG ANSWER";
            } else {
                verdict = "ERROR";
            }
            await Submission({ user: req.session.user._id, problem: problemNumber, code: code, language: language, verdict: verdict })
            return res.status(400).json({ ...response, passed: `${index + 1}/${testCases.length}` })
        }
    }
    await Submission({ user: req.session.user._id, problem: problemNumber, code: code, language: language, verdict: "ACCEPTED" })
    res.status(200).json({ status: "passed", message: "All testcases passed.", passed: `${testCases.length}/${testCases.length}` })
};

const runCode = async (req, res) => {
    let { language, code, input, expectedOutput } = req.body;
    code = atob(code);
    input = atob(input)

    const response = await _runCode(language, code, input, expectedOutput);
    if (response.status == "failed") {
        return res.status(400).json(response)
    }
    res.status(200).json(response)
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

export { submitCode, runCode };

