const express = require('express');
const { addToCart, getCart, updateCartItem, removeCartItem } = require('../Controllers/cartController');
const { authenticate } = require('../Controllers/authMiddleware');

const router = express.Router();

router.post('/cart', authenticate, addToCart);
router.get('/cart', authenticate, getCart);
router.put('/cart/item/:itemId', authenticate, updateCartItem);
router.delete('/cart/item/:itemId', authenticate, removeCartItem);

module.exports = router;
