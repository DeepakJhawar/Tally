import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A submission must be done by a user"],
        },
        problem: {
            type: Number,
            ref: "Problem",
            required: [true, "A submission Must Belong to a problem"],
        },
        savedAt: {
            type: Date,
            default: Date.now(),
        },
        code: {
            type: String,
            required: true,
        },
        language: { type: String, required: true },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const SaveCode = mongoose.model("SaveCode", Schema);
export default SaveCode;
