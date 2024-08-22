import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    givenInput: {
      type: String,
      required: true
    },
    correctOutput: {
      type: String,
      required: true
    },
    problemNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const PendingTestCase = mongoose.model("PendingTestCase", Schema);
export default PendingTestCase;
