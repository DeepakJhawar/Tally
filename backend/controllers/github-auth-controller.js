import axios from 'axios';
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
            user = new User({ username, githubId });
            await user.save();
            res.redirect(`${process.env.ORIGIN_URL}/dashboard`);
        } else {
            // If the user exists, log them in
            req.session.user = user;
            res.redirect(`${process.env.ORIGIN_URL}/dashboard`);
        }

    } catch (error) {
        console.error('Error handling GitHub callback:', error);
        res.redirect('/');
    }
}

export { githubAuth, githubCallback }