const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

const createCheckoutSession = async (req, res) => {
    const clientId = req.user.id;
    console.log("Client ID: ", clientId);
    try {
        const cart = await prisma.cart.findUnique({
            where: { clientId },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const lineItems = cart.items.map((item) => ({
            price_data: {
                currency: 'TND',
                product_data: {
                    name: item.dish.title,
                    images: [item.dish.imageUrl],
                },
                unit_amount: Math.round(item.dish.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating checkout session' });
    }
};

module.exports = { createCheckoutSession };
