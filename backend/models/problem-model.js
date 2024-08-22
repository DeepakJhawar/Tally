import mongoose from "mongoose";
import Counter from "./counter-model.js";

const Schema = new mongoose.Schema(
    {
        problemNumber: {
            type: Number,
            unique: true,
        },
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
        this.problemNumber = await getNextSequenceValue('problemNumber');
    }
    next();
});

const Problem = mongoose.model("Problem", Schema);
export default Problem;
