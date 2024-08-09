import express from 'express';
const router = express.Router();

import { getAllProblems, createProblem } from "../controllers/problems-controller.js";
import { addTestCase, editTestCase} from "../controllers/test-case-controller.js";

router.get("/all-probelms", getAllProblems);
router.get("/create-problem", createProblem);

router.get("/add-test-case", addTestCase);
router.get("/edit-test-case", editTestCase);

export default router;
