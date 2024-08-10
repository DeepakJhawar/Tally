import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Name cannot be empty"],
        },
        examples: {
            type: [String],
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
        submissionsCount: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: [
                true,
                "A problem Should have difficulty either Easy,Medium or Hard",
            ],
        },
        tags: {
            type: [String],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const PendingProblem = mongoose.model("PendingProblem", Schema);
export default PendingProblem;
