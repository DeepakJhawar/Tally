import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    givenInput: {
      type: [String],
    },
    correctOutput: {
      type: mongoose.Schema.Types.Mixed, // This allows for flexibility in the type
      validate: {
        validator: function (value) {
          // Check if the value is an array of strings or an array of arrays of strings
          return (
            Array.isArray(value) &&
            (value.every(item => typeof item === 'string') || // List of strings
              value.every(item => Array.isArray(item) && item.every(subItem => typeof subItem === 'string'))) // List of lists of strings
          );
        },
        message: "correctOutput must be either a list of strings or a list of lists of strings",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TestCase = mongoose.model("TestCase", Schema);
export default TestCase;
