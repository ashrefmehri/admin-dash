const express = require('express');
const { createDish, getAllDishes, getDishesByChef, updateDish, deleteDish , getDishById } = require('../Controllers/dishController');
const { authenticate } = require('../Controllers/authMiddleware');

const router = express.Router();

// Route for creating a dish
router.post('/dishes', authenticate, createDish);

// Route for getting all dishes
router.get('/dishes', getAllDishes);

// Route for getting dishes by chef
router.get('/dishes/chef/:chefId', getDishesByChef);

// Route for updating a dish (restricted to the chef who owns the dish)
router.put('/dishes/:dishId', authenticate, updateDish);

// Route for deleting a dish (restricted to the chef who owns the dish)
router.delete('/dishes/:dishId', authenticate, deleteDish);

// Route for getting a dish by ID
router.get('/dishes/:dishId', getDishById);

module.exports = router;
