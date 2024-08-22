import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

import {
    addTestCase, editTestCase, getPendingTestCaseById,
    getPendingTestCase, addPendingTestCase, declineTestCase
} from "../controllers/test-case-controller.js";


const router = express.Router();

router.post("/add-pending-test-case", verifyToken, addPendingTestCase);
router.post("/add-test-case", verifyToken, adminOnly, addTestCase);
router.post("/edit-testcase", verifyToken, adminOnly, editTestCase);
router.get("/get-pending-testcases", verifyToken, adminOnly, getPendingTestCase);
router.get("/pending-testcases/:testcaseID", verifyToken, adminOnly, getPendingTestCaseById);
router.post("/decline-test-case", verifyToken, adminOnly, declineTestCase);

export default router;
