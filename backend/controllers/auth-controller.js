import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

dotenv.config();

const login = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const user = await User.findOne({ $or: [{ username }, { email }] });
		if (!user)
			return res.status(400).json({ status: "unsucessful", message: 'User not found' });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ status: "unsucessful", message: 'Incorrect Password' });

		const userResponse = { ...user._doc };
		delete userResponse.password;
		
		const token = jwt.sign({ user: userResponse }, process.env.SESSION_SECRET, { expiresIn: '10d' });
		return res.status(200).json({ status: "ok", message: 'Login Successful', user: userResponse, token });
	} catch (err) {
		res.status(500).json({ status: "unsucessful", message: 'Internal Server Error' });
	}
}

const singup = async (req, res) => {
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

		const userResponse = { ...newUser._doc };
		delete userResponse.password;
		const token = jwt.sign({ user: userResponse }, process.env.SESSION_SECRET, { expiresIn: '10d' });
		res.status(201).json({ status: "ok", message: 'User created successfully', user: userResponse, token });
	} catch (error) {
		res.status(500).json({ status: "unsucessful", message: 'Server error', error });
	}
}

const logout = (req, res) => {
	res.redirect('/');
}

export { login, singup, logout };
