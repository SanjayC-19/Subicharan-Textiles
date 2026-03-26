import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/orders', protect, createOrder);
router.get('/orders', protect, adminOnly, getAllOrders);
router.get('/orders/user/:userId', protect, getOrdersByUser);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
