import express from 'express'
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController.js'
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', optionalAuth, getOrders)
router.get('/:id', optionalAuth, getOrderById)
router.post('/', optionalAuth, createOrder)
router.put('/:id/status', authenticate, adminOnly, updateOrderStatus)

export default router
