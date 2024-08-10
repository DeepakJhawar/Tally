import express from 'express';
const router = express.Router();

import { getAllProblems, createProblem, getProblemById } from "../controllers/problems-controller.js";
import { submitCode } from "../controllers/submission-controller.js";
import { addTestCase, editTestCase } from "../controllers/test-case-controller.js";

router.get("/all-problems", getAllProblems);
router.post("/create-problem", createProblem);

router.post("/add-test-case", addTestCase);
router.post("/edit-test-case", editTestCase);

router.post("/submit-code", submitCode);

router.get("/problem/:problem_id", getProblemById);

export default router;
