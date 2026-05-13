import jwt from 'jsonwebtoken';
import { SECRET_JWT_SEED } from '../config.js';

export const generateJWT = ({ 
	id,
	email,
	name,
	surname,
	dniType,
	dniNumber,
	phone,
	gender,
	birthday,
	role,
	status,
 }) => {
	return new Promise((resolve, reject) => {
		const payload = { 
			id,
			email,
			name,
			surname,
			dniType,
			dniNumber,
			phone,
			gender,
			birthday,
			role,
			status,
		};
		const options = { expiresIn: '2h' };

		jwt.sign( 
			payload, 
			SECRET_JWT_SEED, 
			options, 
			(err, token) => {
				(err) 
					? (reject('Could not generate token'), console.log( 'error token:', err ))
					: resolve( token );
			}
		);
	});
};
