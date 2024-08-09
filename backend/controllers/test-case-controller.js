import TestCase from "../models/testcase-model.js"

const addTestCase = async (req, res) => {
    try {
        const { testCaseId, givenInput, correctOutput } = req.body;
        const updatedTestCase = await TestCase.findOneAndUpdate(
            { _id: testCaseId }, // Filter: find by _id
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
        const { testCaseId, givenInput, correctOutput } = req.body;
        const updatedTestCase = await TestCase.findOneAndUpdate(
            { _id: testCaseId }, // Filter: find by _id
            {
                $set: {
                    givenInput: updateData.givenInput,
                    correctOutput: updateData.correctOutput,
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
