const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


///////////////// add to cart 
const addToCart = async (req, res) => {
    const { dishId, quantity, specialRequest } = req.body; // Destructure specialRequest
    const clientId = req.user.id;

    try {
        const dish = await prisma.dish.findUnique({
            where: { id: dishId },
        });
        if (!dish) {
            return res.status(404).json({ error: 'Dish not found' });
        }

        let cart = await prisma.cart.findFirst({
            where: { clientId },
            include: { items: true },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { clientId },
            });
        }

        let cartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                dishId,
            },
        });

        if (cartItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity + quantity,
                    specialRequest, // Update specialRequest
                },
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    quantity,
                    specialRequest, // Set specialRequest when adding new item
                    cartId: cart.id,
                    dishId,
                },
            });
        }

        res.status(201).json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding dish to cart' });
    }
};



///////////////// Get all items in the cart
const getCart = async (req, res) => {
    const clientId = req.user.id;

    try {
        const cart = await prisma.cart.findFirst({
            where: { clientId },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
            },
        });

        if (!cart) {
            return res.status(200).json({ totalItems: 0, items: [] });
        }

        const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

        // Return specialRequest in the response
        const itemsWithRequests = cart.items.map(item => ({
            ...item,
            specialRequest: item.specialRequest,
        }));

        res.status(200).json({ totalItems, items: itemsWithRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching cart' });
    }
};


/////////////// Update quantity of a cart item
const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedItem = await prisma.cartItem.update({
            where: { id: Number(itemId) },
            data: { quantity },
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating cart item' });
    }
};

//////////////////// Remove item from cart
const removeCartItem = async (req, res) => {
    const { itemId } = req.params;

    try {
        await prisma.cartItem.delete({
            where: { id: Number(itemId) },
        });

        res.status(204).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
};
