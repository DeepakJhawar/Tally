import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

import {
    getAllProblems, createProblem,
    createPendingProblem, getProblemById, getPendingProblem
} from "../controllers/problems-controller.js";


import {
    addTestCase, editTestCase,
    getPendingTestCase, addPendingTestCase
} from "../controllers/test-case-controller.js";

import { submitCode, runCode } from "../controllers/submission-controller.js";

const router = express.Router();

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);
router.post("/create-pending-problem", verifyToken, adminOnly, createPendingProblem);
router.post("/get-pending-problem", verifyToken, adminOnly, getPendingProblem);

router.post("/add-test-case", verifyToken, adminOnly, addTestCase);
router.post("/edit-testcase", verifyToken, adminOnly, editTestCase);
router.post("/get-pending-testcases", verifyToken, adminOnly, getPendingTestCase);
router.post("/add-pending-test-case", verifyToken, adminOnly, addPendingTestCase);

router.post("/submit-code", verifyToken, submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problem_id", getProblemById);

export default router;
