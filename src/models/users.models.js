import { Schema, model } from 'mongoose';

const userSquema = Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		default: undefined
	},
	surname: {
		type: String,
		default: undefined
	},
	dniType: {
		type: String,
		default: undefined
	},
	dniNumber: {
		type: Number,
		default: undefined
	},
	phone: {
		type: Number,
		default: undefined
	},
	gender: {
		type: String,
		default: undefined
	},
	birthday: {
		type: Date,
		default: undefined
	},
	role: {
		type: String,
		default: 'customer',
	},
	status: {
		type: Boolean,
		default: true,
	},
});

userSquema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	return { id: _id, ...object };
});

export default model('User', userSquema);
