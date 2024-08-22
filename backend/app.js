import cors from 'cors';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import userRoutes from "./routes/user.js";
import problemsRoutes from "./routes/problems.js";
import testcaseRoutes from "./routes/testcases.js";
import saveCodeRoutes from "./routes/savecode.js";
import contestRoutes from "./routes/contest.js";
import { initializeSocket } from "./sockets-initializer.js";

const app = express();
const server = http.createServer(app);
const PORT = 6969;

// Initialize Socket.IO with the server
initializeSocket(server);

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
app.use('/', testcaseRoutes);
app.use('/', saveCodeRoutes);
app.use('/', contestRoutes);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})