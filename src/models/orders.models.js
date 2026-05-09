import { Schema, model } from 'mongoose';

const orderSquema = Schema({
	id: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	total_price: {
		type: Number,
		required: true,
	},
	discount: {
		type: Boolean,
		required: true,
	},
	list: [{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		prices: {
			retail: {
				type: Number,
				required: true,
			},
			wholesale: {
				type: Number,
				required: true,
			},
		},
		count: {
			type: Number,
			required: true,
		},
	}],
	status: {
		type: String, // active, pending, delivered, cancelled
		required: true,
	},
});

orderSquema.method('toJSON', function () {
	const { __v, ...object } = this.toObject();
	return { ...object };
});

export const Order = model('Order', orderSquema); 
