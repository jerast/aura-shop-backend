import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.AURAB_PORT;
export const DB_CNN = process.env.AURAB_DB_CNN;
export const DB_OFF = process.env.AURAB_DB_OFF;
export const SECRET_JWT_SEED = process.env.AURAB_SECRET_JWT_SEED;
export const CLOUDINARY_URL = process.env.AURAB_CLOUDINARY_URL;
export const CLOUDINARY_KEY = process.env.AURAB_CLOUDINARY_KEY;
export const CLOUDINARY_SECRET = process.env.AURAB_CLOUDINARY_SECRET;
