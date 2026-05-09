import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orders.controllers.js';
import { validateJWT } from '../middlewares/validate_jwt.js';

const router = Router();

// router.use(validateJWT);

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);

export default router;
