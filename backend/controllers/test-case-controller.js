import TestCase from "../models/testcase-model.js"
import Problem from "../models/problem-model.js"

const addTestCase = async (req, res) => {
    try {
        const { problemNumber, givenInput, correctOutput } = req.body;

        const problemData = await Problem.findOne({ problemNumber })
        if (!problemData) {
            res.status(404).json({
                status: 'unsucessful',
                message: `Problem Number not found`,
            });
            return;
        }

        const updatedTestCase = await TestCase.findOneAndUpdate(
            { _id: problemData.testCaseId }, // Filter: find by _id
            {
                $push: {
                    givenInput: { $each: givenInput },
                    correctOutput: { $each: correctOutput },
                },
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run schema validations
            }
        );
        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case updated successfully: ${updatedTestCase}`,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: `Test case not found with ID: ${testCaseId}`,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
}

const editTestCase = async (req, res) => {
    try {
        const { problemNumber, givenInput, correctOutput } = req.body;

        const problemData = await Problem.findOne({ problemNumber })
        if (!problemData) {
            res.status(404).json({
                status: 'unsucessful',
                message: `Problem Number not found`,
            });
            return;

        }

        const updatedTestCase = await TestCase.findOneAndUpdate(
            { _id: problemData.testCaseId }, // Filter: find by _id
            {
                $set: {
                    givenInput: givenInput,
                    correctOutput: correctOutput,
                },
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run schema validations
            }
        );
        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case updated successfully: ${updatedTestCase}`,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: `Test case not found with ID: ${testCaseId}`,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
}

export { addTestCase, editTestCase };
