import TestCase from "../models/testcase-model.js"
import PendingTestCase from "../models/pending-testcase-model.js"
import Problem from "../models/problem-model.js"

const getPendingTestCase = async (req, res) => {
    try {
        // Retrieve all test cases from the PendingTestCase collection
        const response = await PendingTestCase.find({});

        // Send the response with status 200 and the retrieved data
        res.status(200).json({
            status: 'ok',
            data: response,
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        console.error("Error retrieving test cases:", error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while retrieving test cases.',
        });
    }
};

const addPendingTestCase = async (req, res) => {
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

        const updatedTestCase = await PendingTestCase({ problemNumber, givenInput, correctOutput });
        await updatedTestCase.save()

        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case successfully submitted for verification: ${updatedTestCase}`,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'unsuccessful',
            message: err.message,
        });
    }
}

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
                    givenInput: givenInput,
                    correctOutput: correctOutput,
                },
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run schema validations
            }
        );

        try {
            await PendingTestCase.deleteOne({ problemNumber, givenInput, correctOutput });
        } catch { }

        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case updated successfully: ${updatedTestCase}`,
            });
        } else {
            res.status(200).json({
                status: 'ok',
                message: `Test case not found with ID: ${problemData.testCaseId}`,
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
                    givenInput: [givenInput],
                    correctOutput: [correctOutput],
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

export { addTestCase, editTestCase, getPendingTestCase, addPendingTestCase };
