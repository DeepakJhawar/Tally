import express from 'express';
const router = express.Router();

import { getAllProblems, createProblem } from "../controllers/problems-controller.js";

router.get("/all-probelms", getAllProblems);

router.get("/create-problem", createProblem);

export default router;
