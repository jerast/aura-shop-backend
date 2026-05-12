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
	try {
		const order = request.body;
		// const { list } = request.body; 

		// let verifyStock = false; 
		// for ( let i = 0; i < list.length; i++ ) {
		// 	const item = list[i];
		// 	const product = await Product.findById( item.product );
			
		// 	if ( item.count > product.stock ) {
		// 		verifyStock = true;
		// 		break;
		// 	};
		// };

		const totalOrders = await Order.countDocuments();
		const finalOrder = new Order({ 
			...order,
			id: `AUR-${String(totalOrders).padStart(4, '0')}`,
			status: 'pending'
		});

		return response.json({
			ok: true,
			order: finalOrder,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const confirmOrder = async (request, response) => {
	try {
		const { id } = request.params;

		if (!orderExists) {
			return response.status(404).json({
				ok: false,
				message: 'Order not found',
			});
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{ status: 'confirmed' },
			{ new: true }
		);

		await finalOrder.save( async function ( error, result ) {
			result.list.forEach( async item => {
				if (error) return responseError( response, error );
			
				const { stock } = await Product.findById( item.product );
				await Product.findByIdAndUpdate( item.product, { stock: stock - item.count });
			});
		});

		return response.json({
			ok: true,
			order: updatedOrder,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const deliverOrder = async (request, response) => {
	try {
		const { id } = request.params;

		const orderExists = await Order.findById(id);
		if (!orderExists) {
			return response.status(404).json({
				ok: false,
				message: 'Order not found',
			});
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
	try {
		const { id } = request.params;

		const orderExists = await Order.findById(id);
		if (!orderExists) {
			return response.status(404).json({
				ok: false,
				message: 'Order not found',
			});
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{ status: 'canceled' },
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
