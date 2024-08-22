import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: false,
		trim: true,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
	},
	githubId: {
		type: String,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
	solved: {
		type: Object,
	},
	savedCode: {
		type: Object,
	}
});

const User = mongoose.model('User', Schema);
export default User;
