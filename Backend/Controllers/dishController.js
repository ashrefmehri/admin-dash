const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to create a new dish
const createDish = async (req, res) => {
    const { title, description, price, imageUrl } = req.body;
    const chefId = req.user.id; // Assuming you're using middleware to attach the user's ID from the token

    // Validate required fields
    if (!title || !description || !price) {
        return res.status(400).json({ error: "Title, description, and price are required" });
    }

    try {
        const newDish = await prisma.dish.create({
            data: {
                title,
                description,
                price:parseFloat(price),
                imageUrl,
                chef: {
                    connect: { id: chefId }, 
                },
            },
        });
        res.status(201).json(newDish);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating dish' });
    }
};


// Function to get all dishes
const getAllDishes = async (req, res) => {
    try {
        const dishes = await prisma.dish.findMany({
            include: {
                chef: {
                    select: {
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        });
        res.json(dishes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching dishes' });
    }
};
// Function to get dishes by chef
const getDishesByChef = async (req, res) => {
    const { chefId } = req.params; 
    try {
        const dishes = await prisma.dish.findMany({
            where: { chefId: Number(chefId) } 
        });

        if (dishes.length === 0) {
            return res.status(404).json({ message: 'No dishes found for this chef' });
        }

        res.status(200).json(dishes);
    } catch (error) {
        console.error('Error fetching dishes by chef:', error);
        res.status(500).json({ error: 'Failed to retrieve dishes for the chef' });
    }
};
// Function to update a dish
const updateDish = async (req, res) => {
    const { dishId } = req.params;
    const { title, description, price, imageUrl } = req.body;
    const chefId = req.user.id; 

    try {
        const dish = await prisma.dish.findUnique({ where: { id: Number(dishId) } });

        if (!dish) {
            return res.status(404).json({ error: "Dish not found" });
        }

        if (dish.chefId !== chefId) {
            return res.status(403).json({ error: "You are not authorized to update this dish" });
        }

        const updatedDish = await prisma.dish.update({
            where: { id: Number(dishId) },
            data: { title, description, price, imageUrl },
        });

        res.json(updatedDish);
    } catch (error) {
        console.error('Error updating dish:', error);
        res.status(500).json({ error: 'Failed to update dish' });
    }
};

// Function to delete a dish
const deleteDish = async (req, res) => {
    const { dishId } = req.params;
    const chefId = req.user.id; // Assuming user ID is added by authentication middleware

    try {
        const dish = await prisma.dish.findUnique({ where: { id: Number(dishId) } });

        if (!dish) {
            return res.status(404).json({ error: "Dish not found" });
        }

        if (dish.chefId !== chefId) {
            return res.status(403).json({ error: "You are not authorized to delete this dish" });
        }

        await prisma.dish.delete({ where: { id: Number(dishId) } });
        res.status(204).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).json({ error: 'Failed to delete dish' });
    }
};

// Function to get a dish by ID along with its chef details
const getDishById = async (req, res) => {
    const { dishId } = req.params;

    try {
        const dish = await prisma.dish.findUnique({
            where: { id: Number(dishId) },
            include: {
                chef: {
                    select: {
                        id: true, 
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        });

        if (!dish) {
            return res.status(404).json({ error: "Dish not found" });
        }

        res.status(200).json(dish);
    } catch (error) {
        console.error('Error fetching dish by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve dish' });
    }
};

module.exports = {
    createDish,
    getAllDishes,
    getDishesByChef,
    updateDish,
    deleteDish,
    getDishById
};

