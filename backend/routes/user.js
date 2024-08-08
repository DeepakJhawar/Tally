import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import OAuth2Client from 'google-auth-library'

import User from '../Models/user.js';

const router = express.Router();

router.post("/login", async (req, res)=>{
    const { username, email, password } = req.body;
    try{
        const user = await User.findOne({ $or: [{ username } , { email }]});
        if(!user)
            return res.status(400).json({message: 'User not found'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({message: 'Incorrect Password'});
        return res.status(200).json({message: 'Login Successful'});
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }
})

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
  
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_ID, // Replace with your email
      pass: process.env.MAIL_PASSWORD, // Replace with your email password
    },
  });
  
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  
      // Set the reset token and expiration on the user document
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = Date.now() + 180; // 3 mins from now
  
      await user.save();
  
      // Send the reset token via email
      const resetUrl = `http://localhost:6969/reset-password/${resetToken}`;
      const message = `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `;
  
      await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset',
        html: message,
      });
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
        // Hash the token from the URL to match the one stored in the database
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
        // Find the user by the reset token and ensure the token has not expired
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() },
        });
  
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
    
        await user.save();
  
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get('/auth/google', (req, res) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${'http://localhost:3000/auth/google/callback'}&` +
    `response_type=code&` +
    `scope=profile email`;

  res.redirect(redirectUri);
});

// Google authentication callback route
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: 'http://localhost:6969/auth/google/callback',
      grant_type: 'authorization_code'
    });

    const { id_token: idToken } = tokens;

    // Verify the token and get user info
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    // Store user profile information
    req.session.user = payload;

    res.redirect('/profile');
  } catch (error) {
    console.error('Error handling Google callback:', error);
    res.redirect('/');
  }
});

// Profile route to show user information
router.get('/profile', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.redirect('/');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


export default router;