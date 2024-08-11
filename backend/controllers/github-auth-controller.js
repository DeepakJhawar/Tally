import axios from 'axios';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user.js';

const githubAuth = (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?` +
        `client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `redirect_uri=${process.env.BASE_URL}/auth/github/callback&` +
        `scope=user:email`;

    res.redirect(redirectUri);
}

const githubCallback = async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.BASE_URL}/auth/github/callback`,
        }, {
            headers: {
                accept: 'application/json',
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Fetch user data using access token
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { login, name, id: githubId } = userResponse.data;
        const username = name || login

        // Check if user exists in the database
        let user = await User.findOne({ githubId });

        if (!user) {
            // If the user doesn't exist, create a new user
            const password = uuidv4();
            user = new User({ username, githubId, password });
            await user.save();
        }

		user = user.toObject()
        const token = jwt.sign({ user }, process.env.SESSION_SECRET, { expiresIn: '10d' });
        res.redirect(`${process.env.ORIGIN_URL}/problems?token=${token}&role=${user.role}`);
    } catch (error) {
        console.error('Error handling GitHub callback:', error);
        res.redirect('/');
    }
}

export { githubAuth, githubCallback }