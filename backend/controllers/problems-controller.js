import Problem from "../models/problem-model.js"
import Submission from "../models/submission-model.js"
import TestCase from "../models/testcase-model.js"

const getAllProblems = async (req, res) => {
    try {
        const { difficulty } = req.query;

        let query = {};
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const problems = await Problem.find(query);
        const updatedProblems = problems.map(async (problem) => {
            // Check if there's a submission for the problem and user
            problem = problem.toObject()
            const testcase = await TestCase.findById(problem.testCaseId);
            let testcaseObject = testcase ? testcase.toObject() : {};

            if (testcaseObject.givenInput) {
                testcaseObject = testcaseObject.givenInput.slice(0, 2);
            }
            else {
                testcaseObject = [];
            }

            let result = {
                title: problem.title,
                description: problem.description,
                difficulty: problem.difficulty,
                constrains: problem.constrains,
                testcase: testcaseObject,
                testCaseId: problem.testCaseId,
            };

            if (req.session.user) {
                const user = req.session.user._id;
                const submissions = await Submission.find({ user: user, problem: problem.problemNumber });
                result.status = submissions.length > 0 ? "attempted" : "unattempted";
            }
            // Return a new object with the updated status
            return result
        });

        // Wait for all updates to complete
        const finalProblems = await Promise.all(updatedProblems);

        res.status(200).json({
            status: 'ok',
            results: finalProblems.length,
            data: finalProblems,
        });
    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
};

const createProblem = async (req, res) => {
    let { title, givenInput, correctOutput, description, examples, constrains, difficulty, tags } = req.query;
    // Validate the input
    if (!title || !description || !difficulty) {
        return res.status(400).json({
            status: "unsuccessful",
            message: "All fields are required: title, description, difficulty"
        });
    }

    const existingProblem = await Problem.findOne({ title });
    if (!existingProblem) {
        return res.status(400).json({
            status: "unsuccessful",
            message: "Problem already exists"
        });
    }

    difficulty = difficulty.toLowerCase()
    if (!testCaseId) {
        const newTestCase = new TestCase({
            givenInput: givenInput,
            correctOutput: correctOutput
        });
        const savedTestCase = await newTestCase.save();
        testCaseId = savedTestCase._id;
    }

    try {
        // Create a new problem instance
        const newProblem = new Problem({
            title,
            testCaseId,
            description,
            examples,
            difficulty,
            constrains,
            tags
        });

        // Save the new problem to the database
        const savedProblem = await newProblem.save();

        res.status(201).json({
            status: "ok",
            message: "Problem created successfully",
            problem: savedProblem
        });
    } catch (err) {
        res.status(500).json({
            status: "unsuccessful",
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export { getAllProblems, createProblem };
