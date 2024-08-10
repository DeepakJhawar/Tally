import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import userRoutes from "./routes/user.js";
import problemsRoutes from "./routes/problems.js";

const app = express();
const PORT = 6969;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30*24*60*60*1000}, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI // Your MongoDB connection string
  }),
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

app.use('/', userRoutes);
app.use('/', problemsRoutes);


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})