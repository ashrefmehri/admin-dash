// Routes/orderRoutes.js
const express = require('express');
const { 
    placeOrder, 
    getClientOrders, 
    getChefOrders, 
    updateOrderStatus ,
    chefResponseToOrder
} = require('../Controllers/orderController');
const { authenticate } = require('../Controllers/authMiddleware');

const router = express.Router();

// Client places an order
router.post('/orders', authenticate, placeOrder);

// Client gets their orders
router.get('/orders/client', authenticate, getClientOrders);

// Chef gets their orders
router.get('/orders/chef', authenticate, getChefOrders);

// Update order status
router.put('/orders/:orderId', authenticate, updateOrderStatus);
router.put('/orders/:orderId/response', authenticate, chefResponseToOrder);

module.exports = router;
