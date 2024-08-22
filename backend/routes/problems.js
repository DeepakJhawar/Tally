import express from 'express';
import { verifyToken, adminOnly, checkToken } from '../middlewares/login-middleware.js';
import { floodControlMiddleware } from '../middlewares/flood-controll-middleware.js';

import {
    getProblems, createProblem, declineProblem, getPendingProblemById,
    createPendingProblem, getProblemById, getPendingProblem
} from "../controllers/problems-controller.js";
import { submitCode, runCode, getSubmissions } from "../controllers/submission-controller.js";

const router = express.Router();

router.get("/all-problems", checkToken, getProblems);
router.get("/problems", checkToken, getProblems);
router.post("/create-problem", createProblem);
router.post("/create-pending-problem", verifyToken, createPendingProblem);
router.get("/get-pending-problem", verifyToken, adminOnly, getPendingProblem);
router.post("/decline-pending-problem", declineProblem);

router.post("/submit-code", verifyToken, floodControlMiddleware, submitCode);
router.get("/get-submissions", verifyToken, getSubmissions);
router.post("/run-arena-code", checkToken, floodControlMiddleware, runCode);
router.post("/run-playground-code", checkToken, floodControlMiddleware, runCode);

router.get("/problem/:problemId", getProblemById);
router.get("/pending-problem/:problemId", verifyToken, adminOnly, getPendingProblemById);

export default router;
