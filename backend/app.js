import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import UserRoutes from "./routes/user.js";


const app = express();
const PORT = 6969;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

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

app.use('/', UserRoutes);


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})