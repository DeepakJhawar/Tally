import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.MAIL_ID, // Replace with your email
		pass: process.env.MAIL_PASSWORD, // Replace with your email password
	},
	logger: false, // Enable logging
	debug: false, // Include SMTP traffic in logs
});

export default transporter;