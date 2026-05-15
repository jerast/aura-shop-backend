import { Schema, model } from 'mongoose';

const productSquema = Schema({
	name: {
		type: String,
		required: true,
		trim: false,
	},
	reference: {
		type: String,
		unique: true,
	},
	bar_code: {
		type: Number,
		// unique: true,
	},
	description: {
		type: String,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
	prices: {
		buy: {
			type: Number,
			default: 0
		},
		retail: {
			type: Number,
			default: 0
		},
		wholesale: {
			type: Number,
			default: 0
		},
	},
	image: {
		type: String,
	},
	sold_units: {
		type: Number,
		default: 0,
	},
	stock: {
		type: Number,
		default: 0,
	},
	status: {
		type: Boolean,
		default: true,
	},
});

productSquema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	return { id: _id, ...object };
});

export default model('Product', productSquema);
