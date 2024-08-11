import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.BASE_URL
);

const googleAuth = (req, res) => {
	const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${process.env.GOOGLE_CLIENT_ID}&` +
		`redirect_uri=${process.env.BASE_URL}/auth/google/callback&` +
		`response_type=code&` +
		`scope=profile email`;

	res.redirect(redirectUri);
}

const googleCallback = async (req, res) => {
	const { code } = req.query;

	try {
		// Exchange the authorization code for tokens
		const { tokens } = await client.getToken({
			code,
			redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
			grant_type: 'authorization_code'
		});

		const { id_token: idToken } = tokens;

		// Verify the token and get user info
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID
		});

		const payload = ticket.getPayload();
		const { name, email } = payload;

		let user = await User.findOne({ email });
		if (!user) {
			const username = name || email.split('@')[0];
			user = new User({
				username: username,
				email: email,
				password: "", // OAuth users generally don't need a password
			});
			await user.save();
		}
        const token = jwt.sign({ user }, process.env.SESSION_SECRET, { expiresIn: '10d' });
		res.redirect(`${process.env.ORIGIN_URL}/problems?token=${token}&role=${user.role}`);

	} catch (error) {
		console.error('Error handling Google callback:', error);
		res.redirect(`${process.env.ORIGIN_URL}/login`);
	}
}

export { googleAuth, googleCallback };
