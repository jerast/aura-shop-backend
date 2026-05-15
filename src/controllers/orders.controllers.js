import mongoose from 'mongoose';
import { Order } from '../models/orders.models.js';
import { responseError } from '../middlewares/responseError.js';
import Product from '../models/products.models.js';

export const getOrders = async (request, response) => {
	try {
		const { field, value } = request.headers;

		let orders = (field && value) 
			? await Order.find({ [field]: value })
			: await Order.find();

		return response.json({
			ok: true,
			orders,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const createOrder = async (request, response) => {
	const session = await mongoose.startSession();

	try {
		await session.withTransaction(async () => {
			const order = request.body;
			const { list } = order;

			for (const item of list) {
				const product = await Product.findById(item.product).session(session);
				if (!product) {
					throw new Error(`Product not found: ${item.product}`);
				}
			}

			const totalOrders = await Order.countDocuments().session(session);
			const orderData = {
				...order,
				id: `AUR-${String(totalOrders).padStart(4, '0')}`,
				status: 'pending',
				date: new Date()
			};

			const [createdOrder] = await Order.create([orderData]).session(session);

			return response.json({
				ok: true,
				order: createdOrder,
			});
		});
	} catch (error) {
		responseError(response, error);
	} finally {
		session.endSession();
	}
};

export const confirmOrder = async (request, response) => {
	const session = await mongoose.startSession();

	try {
		await session.withTransaction(async () => {
			const { id } = request.params;

			const order = await Order.findById(id).session(session);
			if (!order) {
				throw new Error('Order not found');
			}

			if (order.status !== 'pending') {
				throw new Error(`Cannot confirm order with status: ${order.status}`);
			}

			for (const item of order.list) {
				const product = await Product.findById(item.product).session(session);
				
				if (!product) {
					throw new Error(`Product not found: ${item.product}`);
				}
			}

			const updatedOrder = await Order.findByIdAndUpdate(
				id,
				{ status: 'confirmed' },
				{ new: true }
			).session(session);

			for (const item of order.list) {
				await Product.findByIdAndUpdate(
					item.product,
					{ $inc: { stock: -item.count } }
				).session(session);
			}

			return response.json({
				ok: true,
				order: updatedOrder,
			});
		});
	} catch (error) {
		responseError(response, error);
	} finally {
		session.endSession();
	}
};

export const deliverOrder = async (request, response) => {
	try {
		const { id } = request.params;

		const order = await Order.findById(id);
		if (!order) {
			return response.status(404).json({
				ok: false,
				message: 'Order not found',
			});
		}

		if (order.status !== 'confirmed') {
			throw new Error(`Cannot deliver order with status: ${order.status}`);
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{ status: 'delivered' },
			{ new: true }
		);

		return response.json({
			ok: true,
			order: updatedOrder,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const cancelOrder = async (request, response) => {
	const session = await mongoose.startSession();

	try {
		await session.withTransaction(async () => {
			const { id } = request.params;

			const order = await Order.findById(id).session(session);
			if (!order) {
				throw new Error('Order not found');
			}

			if (order.status !== 'pending') {
				throw new Error(`Cannot cancel order with status: ${order.status}`);
			}

			const updatedOrder = await Order.findByIdAndUpdate(
				id,
				{ status: 'canceled' },
				{ new: true }
			).session(session);

			return response.json({
				ok: true,
				order: updatedOrder,
			});
		});
	} catch (error) {
		responseError(response, error);
	} finally {
		session.endSession();
	}
};
