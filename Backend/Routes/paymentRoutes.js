const express = require('express');
const { createCheckoutSession } = require('../Controllers/paymentController');
const { authenticate } = require('../Controllers/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);

module.exports = router;
