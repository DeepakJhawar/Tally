import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

const router = express.Router();

import { getAllProblems, createProblem, getProblemById } from "../controllers/problems-controller.js";
import { submitCode, runCode } from "../controllers/submission-controller.js";
import { addTestCase, editTestCase, getPendingTestCase, addPendingTestCase } from "../controllers/test-case-controller.js";

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);

router.post("/add-test-case", verifyToken, adminOnly, addTestCase);
router.post("/edit-testcase", verifyToken, adminOnly, editTestCase);
router.post("/get-pending-testcases", verifyToken, adminOnly, getPendingTestCase);
router.post("/add-pending-test-case", verifyToken, adminOnly, addPendingTestCase);

router.post("/submit-code", verifyToken, submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problem_id", getProblemById);

export default router;
