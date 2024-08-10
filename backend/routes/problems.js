import express from 'express';
import { verifyToken } from '../middlewares/login-middleware.js';

const router = express.Router();

import { getAllProblems, createProblem, getProblemById } from "../controllers/problems-controller.js";
import { submitCode, runCode } from "../controllers/submission-controller.js";
import { addTestCase, editTestCase } from "../controllers/test-case-controller.js";

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);

router.post("/add-test-case", addTestCase);
router.post("/edit-test-case", verifyToken, editTestCase);

router.post("/submit-code", verifyToken, submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problem_id", getProblemById);

export default router;
