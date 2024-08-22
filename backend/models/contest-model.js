import mongoose from "mongoose";
import Counter from "./counter-model.js";

const Schema = new mongoose.Schema(
    {
        contestNumber: {
            type: Number,
            unique: true,
        },
        contestTitle: {
            type: String,
            required: [true, "Name cannot be empty"],
        },
        schedule: {
            type: {
                start: {
                    type: Date,
                    required: [true, "A contest must have a start date"],
                },
                end: {
                    type: Date,
                    required: [true, "A contest must have an end date"],
                },
            },
            validate: {
                validator: function (v) {
                    // Ensure that the start date is less than the end date
                    return v.start < v.end;
                },
                message: "The start date must be earlier than the end date.",
            },
        },
        questionIds: {
            type: [mongoose.Schema.ObjectId],
            ref: "ContestQuestions",
        },
        description: {
            type: String,
            required: [true, "A Problem Shoud have it's description"],
        },
        host: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A contest must have a host"],
        },
        participants: {
            type: [
                {
                    user: {
                        type: mongoose.Schema.ObjectId,
                        ref: "User", // Ensure user is always provided
                        required: true,
                    }, score: {
                        type: Number,
                        default: 0, // Set a default score if none is provided
                        required: true,
                    }, lastSubmission: {
                        type: Date,
                        // default: Date.now,
                    },
                }
            ],
        }
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
        this.contestNumber = await getNextSequenceValue('contestNumber');
    }
    next();
});

const Contest = mongoose.model("Contest", Schema);
export default Contest;
