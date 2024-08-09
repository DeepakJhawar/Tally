import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { login, singup } from '../controllers/auth-controller.js'
import { googleAuth, googleCallback } from '../controllers/google-auth-controller.js'
import { githubAuth, githubCallback} from '../controllers/github-auth-controller.js'
import { forgotPassword, resetPassword } from '../controllers/forgot-password-controller.js'

const router = express.Router();

router.post("/login", login)

router.post('/signup', singup);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/auth/google', googleAuth);

// Google authentication callback route
router.get('/auth/google/callback', googleCallback);

// GitHub login route
router.get('/auth/github', githubAuth);


// GitHub callback route
router.get('/auth/github/callback', githubCallback);

// // Profile route to show user information
// router.get('/profile', (req, res) => {
// 	if (req.session.user) {
// 		res.json(req.session.user);
// 	} else {
// 		res.redirect('/');
// 	}
// });

// // Logout route
// router.get('/logout', (req, res) => {
// 	req.session.destroy();
// 	res.redirect('/');
// });


export default router;