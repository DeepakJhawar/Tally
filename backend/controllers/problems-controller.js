import Problem from "../models/problem-model.js"
import TestCase from "../models/testcase-model.js"

const getAllProblems = async (req, res) => {
    try {
        const { difficulty } = req.query;

        let query = {};
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const problems = await Problem.find(query).populate('submissions');

        res.status(200).json({
            status: 'ok',
            results: problems.length,
            data: problems,
        });
    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
};

const createProblem = async (req, res) => {
    let { title, testCaseId, description, difficulty, tags } = req.query;
    // Validate the input
    if (!title || !description || !difficulty ) {
        return res.status(400).json({
            status: "unsuccessful",
            message: "All fields are required: title, description, difficulty, tags"
        });
    }

    const existingProblem = await User.findOne({ title });
    if (!existingProblem) {
		return res.status(400).json({
            status: "unsuccessful",
            message: "Problem already exists"
        });
    }

    difficulty = difficulty.toLowerCase()
    if (!testCaseId){
        const newTestCase = new TestCase({
            givenInput: [],
            correctOutput: []
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
            difficulty,
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
