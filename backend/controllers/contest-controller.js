import fs from "fs";

import ContestQuestions from "../models/contest-problems-model.js";
import TestCase from "../models/testcase-model.js";
import Contest from "../models/contest-model.js";
import User from "../models/user.js";

const createContest = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const { contestTitle, schedule, description } = req.body;

        const contest = await Contest.create({
            contestTitle,
            schedule,
            description,
            host: userId,
        });

        res.status(201).json({
            status: "ok",
            data: contest,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    }
};

const getContest = async (req, res) => {
    try {
        const user = req.user.user || {};
        const userId = user._id;

        const type = req.query.type;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title;

        const now = new Date();
        const query = {};

        if (type == "upcoming") {
            query["schedule.start"] = { $gte: now };
        }
        if (type == "ongoing") {
            query["schedule.start"] = { $lte: now };
            query["schedule.end"] = { $gte: now };
        }
        if (type == "previous") {
            query["schedule.end"] = { $lt: now };
        }
        if (title) {
            query.contestTitle = new RegExp(title, "i");
        }

        const contest = await Contest.find(
            query,
            "_id contestNumber contestTitle schedule host participants"
        )
            .limit(limit)
            .skip((page - 1) * limit);

        const updatedContest = contest.map((item) => {
            const participants = item.participants || [];
            return {
                ...item._doc, // Spread the original document's properties
                isHost: item.host == userId, // Add the isHost key
                isRegistered: participants.some((participant) =>
                    participant.user.equals(userId)
                ),
            };
        });

        const totalDocuments = await Contest.countDocuments(query);
        const hasNextPage = page * limit < totalDocuments;
        return res.status(200).json({
            status: "ok",
            data: updatedContest,
            totalDocuments,
            hasNextPage,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "unsuccessful",
            data: "Internal Server Error",
            error: err.message,
        });
    }
};

const createContestQuestion = async (req, res) => {
    try {
        const {
            contestId,
            title,
            positivePoints,
            negativePoints,
            description,
            difficulty,
            constraints,
        } = req.body;
        const user = req.user.user || {};
        const userId = user._id;

        if (!contestId) {
            return res.status(400).json({
                status: "unsuccessful",
                data: "contest ID not found!",
            });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found",
            });
        }

        if (contest.host != userId) {
            return res.status(400).json({
                status: "unsuccessful",
                data: "User not authorized to add questions to the contest",
            });
        }

        let jsonData;
        try {
            // Parse the JSON content
            const fileContent = fs.readFileSync(req.file.path, "utf-8");
            jsonData = JSON.parse(fileContent);
        } catch (parseError) {
            res.status(400).send({
                status: "unsucessful",
                data: "Invalid JSON format",
                error: parseError.message,
            });
            return;
        }

        // Aggregate inputs and outputs
        const givenInputs = [];
        const correctOutputs = [];
        jsonData.forEach(({ input, output }) => {
            givenInputs.push(input);
            correctOutputs.push(output);
        });

        // Create a new TestCase document
        const newTestCase = new TestCase({
            givenInput: givenInputs,
            correctOutput: correctOutputs,
        });

        // Save the document to the database
        await newTestCase.save();

        const question = await ContestQuestions.create({
            contestId,
            title,
            points: { positive: positivePoints, negative: negativePoints },
            description,
            difficulty,
            constraints,
            testCaseId: newTestCase._id,
        });

        contest.questionIds.push(question._id);
        await contest.save();

        res.status(201).json({
            status: "ok",
            data: "Sucessfully added new Question.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    } finally {
        try {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
        } catch (err) {
            console.log(err);
        }
    }
};

const getContestQuestions = async (req, res) => {
    try {
        const { contestId } = req.params;
        const user = req.user.user || {};
        const userId = user._id;

        if (!contestId) {
            return res.status(400).json({ message: "contest ID not found!" });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found",
            });
        }

        const response = {
            contestTitle: contest.contestTitle,
            contestNumber: contest.contestNumber,
            description: contest.description,
            schedule: contest.schedule,
            isHost: contest.host == userId,
            isRegistered: contest.participants.some((participant) =>
                participant.user.equals(userId)
            ),
        };

        if (response.isHost || contest.schedule.start < new Date()) {
            const questions = await ContestQuestions.find(
                { _id: { $in: contest.questionIds } },
                "_id problemNumber title points"
            );
            response.questions = questions;
        }

        res.status(200).json({
            status: "ok",
            data: response,
        });
    } catch (err) {
        res.status(500).json({
            status: "unsuccessful",
            message: err.message,
        });
    }
};

const getContestQuestionById = async (req, res) => {
    try {
        const { questionId } = req.query;
        const user = req.user.user || {};
        const userId = user._id;

        const question = await ContestQuestions.findById(questionId);
        if (!question) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest Question ID not found",
            });
        }

        const contest = await Contest.findById(question.contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found",
            });
        }

        if (contest.host != userId && contest.schedule.start > new Date()) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest not started yet",
            });
        }

        let questions = await ContestQuestions.findById(
            contest.questionIds,
            "_id title description constraints difficulty points testCaseId"
        );

        questions = questions.toObject()
        const testcase = await TestCase.findById(questions.testCaseId);
        let testcaseObject = {};
        if (testcase) {
            testcaseObject = testcase.toObject();
            // Slice givenInput and correctOutput to include only the first 2 elements
            testcaseObject.givenInput = testcaseObject.givenInput
                ? testcaseObject.givenInput.slice(0, 2)
                : [];
            testcaseObject.correctOutput = testcaseObject.correctOutput
                ? testcaseObject.correctOutput.slice(0, 2)
                : [];
        }

        // Initialize examples array if it doesn't exist
        if (!questions.examples) {
            questions.examples = [];
        }

        questions.examples.push(testcaseObject);
        res.status(200).json({
            status: "ok",
            data: questions,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    }
};

const registerContest = async (req, res) => {
    try {
        const { contestId } = req.body;
        const user = req.user.user || {};
        const userId = user._id;

        if (!contestId) {
            return res.status(400).json({ message: "contest ID not found!" });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found",
            });
        }

        if (
            contest.participants.some((participant) =>
                participant.user.equals(userId)
            )
        ) {
            return res.status(400).json({
                status: "unsuccessful",
                data: "User already registered for the contest",
            });
        }
        contest.participants.push({ user: userId, score: 0 });
        await contest.save();

        res.status(200).json({
            status: "ok",
            data: "User registered for the contest",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    }
};

export {
    getContest,
    getContestQuestions,
    getContestQuestionById,
    createContest,
    registerContest,
    createContestQuestion,
};
