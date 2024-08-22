import multer from 'multer';
import express from 'express';
import path from 'path';
import fs from 'fs';

import { verifyToken, checkToken } from '../middlewares/login-middleware.js';
import { getLeaderboard } from '../controllers/leaderboard-controller.js';
import {
    createContest, getContest, createContestQuestion,
    getContestQuestions, getContestQuestionById, registerContest
} from '../controllers/contest-controller.js';
import { submitContestCode } from '../controllers/submission-controller.js';
import { get } from 'http';

const router = express.Router();

const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Name the file uniquely
    },
});

const upload = multer({ storage: storage });

router.get("/all-contest", checkToken, getContest);
router.get("/get-contest-question/:contestId", checkToken, getContestQuestions);
router.get("/get-contest-question-by-id", checkToken, getContestQuestionById);
router.post("/create-contest", verifyToken, createContest);
router.post("/register-contest", verifyToken, registerContest);
router.post("/create-contest-problem", upload.single('file'), verifyToken, createContestQuestion);
router.post("/submit-contest-code", verifyToken, submitContestCode);

router.get("/get-standings", checkToken, getLeaderboard);

export default router;
