import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    givenInput: {
      type: [String],
    },
    correctOutput: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
``
const TestCase = mongoose.model("TestCase", Schema);
export default TestCase;
