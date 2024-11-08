
const express = require('express');
const { getAllChefs , updateChefProfile } = require('../Controllers/chefController');
const { authenticate } = require('../Controllers/authMiddleware');
const router = express.Router();


// Route for getting all chefs
router.get('/allchefs', getAllChefs);

// Route for updating chef profile
router.put('/chefs/:id', authenticate,updateChefProfile);

module.exports = router;
