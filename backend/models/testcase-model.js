import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    givenInput: {
      type: [Object],
    },
    correctOutput: {
      type: [Object],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TestCase = mongoose.model("TestCase", Schema);
export default TestCase;
