import express from 'express';
const router = express.Router();

import { getAllProblems, createProblem } from "../controllers/problems-controller.js";
import { submitCode, runCode } from "../controllers/submission-controller.js";
import { addTestCase, editTestCase } from "../controllers/test-case-controller.js";

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);

router.post("/add-test-case", addTestCase);
router.post("/edit-test-case", editTestCase);

router.post("/submit-code", submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problem_id", getProblemById);

export default router;
