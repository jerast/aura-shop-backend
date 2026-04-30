import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categories.routes.js';
import productsRoutes from './routes/products.routes.js';
import bannersRoutes from './routes/banners.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import resuppliesRoutes from './routes/resupplies.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

// Middlewares
const allowedOrigins = [
  "http://aura-belleza.shop",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use( express.json() );

// Routes
app.use( '/api/categories', categoriesRoutes );
app.use( '/api/products', productsRoutes );S
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
