import Problem from "../models/problem-model.js";
import Submission from "../models/submission-model.js";
import TestCase from "../models/testcase-model.js";

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
			problem = problem.toObject();

			let result = {
				problem_id: problem.problemNumber,
				title: problem.title,
				description: problem.description,
				difficulty: problem.difficulty,
				tags: problem.tags,
				constrains: problem.constrains,
				status: "unattempted",
			};

			if (req.user) {
				const user = req.user._id;
				const submissions = await Submission.find({
					user: user,
					problem: problem.problemNumber,
					verdict: "ACCEPTED"
				});
				const totalSubmissions = await Submission.find({
					user: user,
					problem: problem.problemNumber,
				});
				result.status = totalSubmissions.length > 0 ? "attempted" : "unsolved";
				if (submissions.length > 0) {
					result.status = "solved"
				}
			}
			// Return a new object with the updated status
			return result;
		});

		// Wait for all updates to complete
		const finalProblems = await Promise.all(updatedProblems);

		res.status(200).json({
			status: "ok",
			results: finalProblems.length,
			data: finalProblems,
		});
	} catch (err) {
		res.status(500).json({
			status: "unsuccessful",
			message: err.message,
		});
	}
};

const getProblemById = async (req, res) => {
	const { problem_id } = req.params;

	if (!problem_id) {
		return res.status(400).json({ message: "Problem ID not found!" });
	}

	let problem = await Problem.findOne({ problemNumber: problem_id });
	if (!problem) {
		return res.status(404).json({ message: "Problem not found" });
	}

	problem = problem.toObject();

	const testcase = await TestCase.findById(problem.testCaseId);

	let testcaseObject = {};
	if (testcase) {
		testcaseObject = testcase.toObject();

		// Slice givenInput and correctOutput to include only the first 2 elements
		testcaseObject.givenInput = testcaseObject.givenInput ? testcaseObject.givenInput.slice(0, 2) : [];
		testcaseObject.correctOutput = testcaseObject.correctOutput ? testcaseObject.correctOutput.slice(0, 2) : [];
	}

	// Initialize examples array if it doesn't exist
	if (!problem.examples) {
		problem.examples = [];
	}

	problem.examples.push(testcaseObject);
	return res.status(200).json({ status: "ok", data: problem });
};

const createProblem = async (req, res) => {
	let {
		title,
		givenInput,
		correctOutput,
		description,
		constraints,
		examples,
		difficulty,
		tags,
	} = req.body;

	// Validate the input
	if (!title || !description || !difficulty) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "All fields are required: title, description, difficulty",
		});
	}

	const existingProblem = await Problem.findOne({ title });

	if (existingProblem) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "Problem already exists",
		});
	}

	difficulty = difficulty.toLowerCase();
	
	let testcaseObject = {
		givenInput: [],
		correctOutput: []
	};
	if (givenInput) {
		testcaseObject.givenInput.push(givenInput);
	}
	if (correctOutput) {
		testcaseObject.correctOutput.push(correctOutput);
	}

	const newTestCase = new TestCase(testcaseObject);
	const savedTestCase = await newTestCase.save();
	const testCaseId = savedTestCase._id;

	try {
		// Create a new problem instance
		const newProblem = new Problem({
			title,
			testCaseId,
			description,
			examples,
			difficulty,
			constraints,
			tags,
		});

		// Save the new problem to the database
		const savedProblem = await newProblem.save();

		res.status(201).json({
			status: "ok",
			message: "Problem created successfully",
			problem: savedProblem,
		});
	} catch (err) {
		res.status(500).json({
			status: "unsuccessful",
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

const createPendingProblem = async (req, res) => {
	let {
		title,
		givenInput,
		correctOutput,
		description,
		constraints,
		examples,
		difficulty,
		tags,
	} = req.body;

	// Validate the input
	if (!title || !description || !difficulty) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "All fields are required: title, description, difficulty",
		});
	}

	const existingProblem = await Problem.findOne({ title });

	if (existingProblem) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "Problem already exists",
		});
	}

	difficulty = difficulty.toLowerCase();
	
	let testcaseObject = {
		givenInput: [],
		correctOutput: []
	};
	if (givenInput) {
		testcaseObject.givenInput.push(givenInput);
	}
	if (correctOutput) {
		testcaseObject.correctOutput.push(correctOutput);
	}

	const savedTestCase = new TestCase.findOne(testcaseObject);
	if (!savedTestCase){
		return res.status(200).json({
			status: "unsuccessful",
			message: "TestCase ID not found"
		})
	}
	const testCaseId = savedTestCase._id;

	try {
		// Create a new problem instance
		const newProblem = new Problem({
			title,
			testCaseId,
			description,
			examples,
			difficulty,
			constraints,
			tags,
		});

		// Save the new problem to the database
		const savedProblem = await newProblem.save();

		res.status(201).json({
			status: "ok",
			message: "Problem created successfully",
			problem: savedProblem,
		});
	} catch (err) {
		res.status(500).json({
			status: "unsuccessful",
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

const getPendingProblem = async (req, res) => {
	let {
		title,
		givenInput,
		correctOutput,
		description,
		constraints,
		examples,
		difficulty,
		tags,
	} = req.body;

	// Validate the input
	if (!title || !description || !difficulty) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "All fields are required: title, description, difficulty",
		});
	}

	const existingProblem = await Problem.findOne({ title });

	if (existingProblem) {
		return res.status(400).json({
			status: "unsuccessful",
			message: "Problem already exists",
		});
	}

	difficulty = difficulty.toLowerCase();
	
	let testcaseObject = {
		givenInput: [],
		correctOutput: []
	};
	if (givenInput) {
		testcaseObject.givenInput.push(givenInput);
	}
	if (correctOutput) {
		testcaseObject.correctOutput.push(correctOutput);
	}

	const savedTestCase = new TestCase.findOne(testcaseObject);
	if (!savedTestCase){
		return res.status(200).json({
			status: "unsuccessful",
			message: "TestCase ID not found"
		})
	}
	const testCaseId = savedTestCase._id;

	try {
		// Create a new problem instance
		const newProblem = new Problem({
			title,
			testCaseId,
			description,
			examples,
			difficulty,
			constraints,
			tags,
		});

		// Save the new problem to the database
		const savedProblem = await newProblem.save();

		res.status(201).json({
			status: "ok",
			message: "Problem created successfully",
			problem: savedProblem,
		});
	} catch (err) {
		res.status(500).json({
			status: "unsuccessful",
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

export { getAllProblems, createProblem, createPendingProblem, getProblemById, getPendingProblem };
