import mongoose from 'mongoose';
import { responseError } from '../middlewares/responseError.js';
import Product from '../models/products.models.js';
import Category from '../models/categories.models.js';
import { uploadImage, deleteImage } from '../cloudinary.js';

export const getProducts = async (request, response) => {
	try {
		const products = 
			await Product.find().populate({ path: 'category', select: 'name', transform: (doc, id) => doc.name });

		return response.json({
			ok: true,
			products,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const getProduct = async (request, response) => {
	try {
		const { id } = request.params;

		const product = await Product.findById(id);

		if (!product) {
			return response.status(404).json({
				ok: false,
				message: `Product not found`,
			});
		}

		return response.json({
			ok: true,
			product,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const createProduct = async (request, response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { name, reference, bar_code, description, category, buy, retail, wholesale, stock } = request.body;
		console.log(request.body);
		
		const image = request.files?.image;

		let imagePublicId = null;
		if (image) {
			const result = await uploadImage(image.tempFilePath);
			imagePublicId = result.public_id.split('/').pop();
		}

		const productData = {
			name,
			reference,
			bar_code,
			description,
			category,
			prices: {
				retail: retail,
				wholesale: wholesale,
			},
			stock,
			image: imagePublicId,
		};

		const [createdProduct] = await Product.create([productData], { session });

		const finalProduct = await Product.findById(createdProduct._id)
			.populate('category', 'name')
			.session(session);

		await session.commitTransaction();
		session.endSession();

		const productResponse = {
			...finalProduct.toObject(),
			category: finalProduct.category?.name || null
		};

		return response.json({
			ok: true,
			product: productResponse,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		responseError(response, error);
	}
};

export const updateProduct = async (request, response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = request.params;
		const image = request.files?.image;
		let { retail, wholesale, ...updateData } = request.body;

		const product = await Product.findById(id).session(session);

		if (image) {
			if (product.image) {
				await deleteImage(`Aura-B/products/${product.image}`);
			}
			const result = await uploadImage(image.tempFilePath);
			updateData.image = result.public_id.split('/').pop();
		}

		await Product.findByIdAndUpdate(
			id,
			{
				...updateData,
				prices: {
					retail,
					wholesale,
				},
			},
			{ new: true }
		).session(session);

		const finalProduct = await Product.findById(id)
			.populate({ path: 'category', select: 'name', transform: (doc, id) => doc.name })
			.session(session);
			

		await session.commitTransaction();
		session.endSession();

		return response.json({
			ok: true,
			product: finalProduct,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		responseError(response, error);
	}
};

export const toggleProduct = async (request, response) => {
	try {
		const { id } = request.params;

		const product = await Product.findById(id);

		if (!product) {
			return response.status(404).json({
				ok: false,
				message: `Product not found`,
			});
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ status: !product._doc.status },
			{ new: true }
		);

		return response.json({
			ok: true,
			product: updatedProduct,
		});
	} catch (error) {
		responseError(response, error);
	}
};

export const deleteProduct = async (request, response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = request.params;

		const product = await Product.findById(id).session(session);

		if (!product) {
			throw new Error('Product not found');
		}

		if (product.image) {
			await deleteImage(`Aura-B/products/${product.image}`);
		}

		const [updatedProduct] = await Product.findByIdAndUpdate(
			id,
			{ status: false },
			{ new: true }
		).session(session);

		await session.commitTransaction();
		session.endSession();

		return response.json({
			ok: true,
			message: 'Product hidden',
			product: updatedProduct,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		responseError(response, error);
	}
};