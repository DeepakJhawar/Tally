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

const getPendingTestCaseById = async (req, res) => {
    try {
        const { testcaseID } = req.params;
        const response = await PendingTestCase.findById(testcaseID);

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

        const checkTestCase = await PendingTestCase.findOne({ problemNumber, givenInput, correctOutput })
        if (checkTestCase) {
            res.status(409).json({
                status: 'unsucessful',
                message: `Testcase Already submitted for verification`,
            });
            return;
        }

        const testCase = await TestCase.findOne({ _id: problemData.testCaseId });
        if (!testCase) {
            res.status(500).json({
                status: 'unsucessful',
                message: `Failed to add the testCase`,
            });
            return;
        }

        const index = testCase.givenInput.indexOf(givenInput)
        if (index != 1) {
            if (testCase.correctOutput[index] == correctOutput) {
                res.status(409).json({
                    status: 'unsucessful',
                    message: `Duplicate Test case`,
                });
                return;
            }
        }

        const updatedTestCase = await PendingTestCase({ problemNumber, givenInput, correctOutput, title: problemData.title });
        await updatedTestCase.save()

        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case successfully submitted for verification.`,
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
        const { testcaseID } = req.body;
        const pendingTestCase = await PendingTestCase.findById(testcaseID)
        if (!pendingTestCase) {
            res.status(404).json({
                status: 'unsucessful',
                message: `TestCase ID not found`,
            });
            return;
        }

        const problem = await Problem.findOne({ problemNumber: pendingTestCase.problemNumber })
        if (!problem) {
            res.status(404).json({
                status: 'unsucessful',
                message: `problem not found`,
            });
            return;
        }

        const testCase = await TestCase.findOne({ _id: problem.testCaseId });
        if (!testCase) {
            res.status(404).json({
                status: 'unsucessful',
                message: `Test case not found with ID: ${problem.testCaseId}`,
            });
            return;
        }

        const index = testCase.givenInput.indexOf(pendingTestCase.givenInput)
        if (index != 1) {
            if (testCase.correctOutput[index] == pendingTestCase.correctOutput) {
                res.status(409).json({
                    status: 'unsucessful',
                    message: `Duplicate Test case`,
                });
                return;
            }
        }

        const updatedTestCase = await TestCase.updateOne(
            { _id: problem.testCaseId }, // Filter: find by _id
            {
                $push: {
                    givenInput: pendingTestCase.givenInput,
                    correctOutput: pendingTestCase.correctOutput,
                },
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run schema validations
            }
        );


        try {
            await PendingTestCase.deleteOne({ _id: testcaseID });
        } catch { }

        if (updatedTestCase) {
            res.status(200).json({
                status: 'ok',
                message: `Test case added successfully`,
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

const declineTestCase = async (req, res) => {
    try {
		let { testcaseID } = req.body;

		const pendingTestCase = await PendingTestCase.findById(testcaseID);
		if (!pendingTestCase) {
			return res.status(400).json({
				status: "unsuccessful",
				message: "Pending Test ID doesnt exists",
			});
		}

		await PendingTestCase.deleteOne({ _id: testcaseID });
		res.status(201).json({
			status: "ok",
			message: "Declined Sucessfully",
		});
	} catch (err) {
		res.status(500).json({
			status: "unsuccessful",
			message: "Internal Server Error",
			error: err.message,
		});
	}

}
export { addTestCase, editTestCase, getPendingTestCase, addPendingTestCase, getPendingTestCaseById, declineTestCase };
