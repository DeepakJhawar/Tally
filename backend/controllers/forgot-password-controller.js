import crypto from 'crypto';
import bcrypt from 'bcrypt';

import transporter from '../utils/mail.js';
import User from '../models/user.js';

const forgotPassword = async (req, res) => {
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
        user.resetPasswordExpires = Date.now() + 180 * 1000; // 3 mins from now

        await user.save();

        // Send the reset token via email
        const resetUrl = `${process.env.ORIGIN_URL}/reset-password?token=${resetToken}`;
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

        res.status(200).json({ status: "ok", message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ status: "unsucessful", message: 'Server error', error });
    }
}

const resetPassword = async (req, res) => {
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

		res.status(200).json({ status: "ok", message: 'Password reset successful' });
	} catch (error) {
		res.status(500).json({ status: "unsucessful", message: 'Server error', error });
	}
}

export { forgotPassword, resetPassword };