import mongoose from "mongoose";
import Counter from "./counter-model.js";

const Schema = new mongoose.Schema(
    {
        contestId: {
            type: mongoose.Schema.ObjectId,
            ref: "Contest",
            required: [true, "A contest must be present for a problem"],
        },
        problemNumber: {
            type: Number,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Name cannot be empty"],
        },
        testCaseId: {
            type: mongoose.Schema.ObjectId,
            ref: "TestCase",
            required: [true, "A test case must be present for a problem"],
        },
        description: {
            type: String,
            required: [true, "A Problem Shoud have it's description"],
        },
        constraints: {
            type: String,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: [
                true,
                "A problem Should have difficulty either Easy,Medium or Hard",
            ],
        },
        points: {
            type: {
                positive: {
                    type: Number,
                    required: true,
                },
                negative: {
                    type: Number,
                    default: 0,
                },
            },
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

Schema.pre('save', async function (next) {
    if (this.isNew) {
        this.problemNumber = await getNextSequenceValue('contestProblemNumber');
    }
    next();
});

const ContestQuestions = mongoose.model("ContestQuestions", Schema);
export default ContestQuestions;
