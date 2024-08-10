import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

import {
    addTestCase, editTestCase,
    getPendingTestCase, addPendingTestCase
} from "../controllers/test-case-controller.js";


const router = express.Router();

router.post("/add-test-case", verifyToken, adminOnly, addTestCase);
router.post("/edit-testcase", verifyToken, adminOnly, editTestCase);
router.post("/get-pending-testcases", verifyToken, adminOnly, getPendingTestCase);
router.post("/add-pending-test-case", verifyToken, adminOnly, addPendingTestCase);

export default router;