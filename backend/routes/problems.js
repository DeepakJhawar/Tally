import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

import {
    getAllProblems, createProblem, declineProblem,
    createPendingProblem, getProblemById, getPendingProblem
} from "../controllers/problems-controller.js";

import { submitCode, runCode } from "../controllers/submission-controller.js";

const router = express.Router();

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);
router.post("/create-pending-problem", verifyToken, createPendingProblem);
router.get("/get-pending-problem", verifyToken, adminOnly, getPendingProblem);
router.post("/decline-pending-problem", declineProblem);

router.post("/submit-code", verifyToken, submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problemId", getProblemById);

export default router;
