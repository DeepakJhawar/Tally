import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A user must be present for a submission"],
        },
        contestId: {
            type: mongoose.Schema.ObjectId,
            required: [true, "contestNumber cannot be empty"],
        },
        problemNumber: {
            type: String,
            required: [true, "problemNumber cannot be empty"],
        },
        code: {
            type: Object,
            required: [true, "code cannot be empty"],
        },
        language: {
            type: String,
            required: [true, "language cannot be empty"],
        },
        verdict: {
            type: String,
            enum: ["ACCEPTED", "WRONG ANSWER", "MEMORY LIMIT EXCEEDED", "TIME LIMIT EXCEEDED", "ERROR"],
            required: [true, "You should provide the verdict"],
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ContestSubmissions = mongoose.model("ContestSubmissions", Schema);
export default ContestSubmissions;
