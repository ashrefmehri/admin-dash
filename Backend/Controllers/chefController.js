const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get all chefs with specific fields
const getAllChefs = async (req, res) => {
    try {
        const chefs = await prisma.chef.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true,
                email: true, 
                phone: true, 
            }
        });
        res.status(200).json(chefs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chefs' });
    }
};
// Function to update chef profile
const updateChefProfile = async (req, res) => {
    const { id } = req.params; // Chef ID from URL parameter
    const { name, email, phone, imageUrl } = req.body;

    try {
        const updatedChef = await prisma.chef.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                phone,
                imageUrl,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                imageUrl: true,
            },
        });

        res.status(200).json(updatedChef);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
};

module.exports = {
    getAllChefs,
    updateChefProfile,
};






