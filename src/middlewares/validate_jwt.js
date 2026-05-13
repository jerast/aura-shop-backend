import jwt from "jsonwebtoken";
import { SECRET_JWT_SEED } from "../config.js";

export const validateJWT = (request, response, next) => {
   const token = request.header('x-token');

   if ( !token ) {
      return response.status(401).json({
         ok: false,
         message: 'There is no token on request',
      });
   }

   try {
      const { id, email, name, surname, dniType, dniNumber, phone, gender, birthday, role, status } = jwt.verify(
         token, 
         SECRET_JWT_SEED
      );

      request.session = { id, name, surname, email, phone, role, dniType, dniNumber, gender, birthday, status };
   } 
   catch (error) { 
      return response.status(401).json({
         ok: false,
         message: 'Invalid token',
      });
   }

   next();
};