import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_URL, CLOUDINARY_KEY, CLOUDINARY_SECRET } from './config.js';

cloudinary.config({
	cloud_name: 'jerastcloud',
	api_key: CLOUDINARY_KEY,
	api_secret: CLOUDINARY_SECRET,
});

export const uploadImage = async (filePath) => {
	const result = await cloudinary.uploader.upload(filePath, {
		folder: 'Aura-B/products',
	});
	return result;
};

export const deleteImage = async (publicId) => {
	await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;