import { Router } from 'express';
import { 
  getOrders,
  createOrder,
  confirmOrder,
  deliverOrder,
  cancelOrder,
  pendingOrder
} from '../controllers/orders.controllers.js';
import { validateJWT } from '../middlewares/validate_jwt.js';

const router = Router();

// router.use(validateJWT);

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/pending/:id', pendingOrder);
router.put('/confirm/:id', confirmOrder);
router.put('/deliver/:id', deliverOrder);
router.put('/cancel/:id', cancelOrder);

export default router;
