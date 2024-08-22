import express from 'express';
import { verifyToken } from '../middlewares/login-middleware.js';

import {
    saveCode, getsavedCode
} from "../controllers/save-code-controller.js";


const router = express.Router();

router.get("/get-saved-code", verifyToken, getsavedCode);
router.post("/save-code", verifyToken, saveCode);

export default router;
