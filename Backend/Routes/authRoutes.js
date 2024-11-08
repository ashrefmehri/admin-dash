const express = require('express');
const {
    registerClient,
    registerChef,
    registerDeliveryBoy,
    registerAdmin,
    login,
} = require('../Controllers/authController');

const router = express.Router();

// Client Routes
router.post('/client/register', registerClient);

// Chef Routes
router.post('/chef/register', registerChef);

// DeliveryBoy Routes
router.post('/deliveryboy/register', registerDeliveryBoy);

// Admin Routes
router.post('/admin/register', registerAdmin);

// Universal Login Route
router.post('/login', login);

module.exports = router;
