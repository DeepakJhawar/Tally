import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter
