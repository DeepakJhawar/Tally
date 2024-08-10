import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/user.js";
import problemsRoutes from "./routes/problems.js";

const app = express();
const PORT = 6969;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB via Mongoose');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
};
connectDB();

app.use('/', userRoutes);
app.use('/', problemsRoutes);


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})