import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import categoriesRoutes from './routes/categories.routes.js';
import productsRoutes from './routes/products.routes.js';
import bannersRoutes from './routes/banners.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import resuppliesRoutes from './routes/resupplies.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

// Middlewares
const allowedOrigins = [
  "https://aura-belleza.shop",
  "https://www.aura-belleza.shop",
  "https://admin.aura-belleza.shop",
  // "http://localhost:5173",
  // "http://localhost:5174",
];

app.use(cors({
  origin: (origin, callback) => (!origin || allowedOrigins.includes(origin)) 
    ? callback(null, true) 
    : callback(new Error("Not allowed by CORS")),
  credentials: true,
}));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: '/tmp/',
}));

app.use( express.json() );

// Routes
app.use( '/api/categories', categoriesRoutes );
app.use( '/api/products', productsRoutes );
app.use( '/api/banners', bannersRoutes );
app.use( '/api/orders', ordersRoutes );
app.use( '/api/resupplies', resuppliesRoutes );
app.use( '/api/users', usersRoutes );

// 404
app.use((request, response, next) => {
	response.status(404).json({
		message: 'endpoing not fount',
	});
});

export default app;
