// Controllers/orderController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Place an order
const placeOrder = async (req, res) => {
    const { totalAmount, chefId, deliveryBoyId } = req.body; // Assume these values are sent from the client
    const clientId = req.user.id; // Get the client ID from the authenticated user

    try {
        // Create the order with status set to PENDING
        const order = await prisma.order.create({
            data: {
                totalAmount,
                status: 'PENDING',
                clientId,
                chefId,
                deliveryBoyId,
            },
        });

        // Create a notification for the chef regarding this new order
        await prisma.notification.create({
            data: {
                orderId: order.id,
                chefId,
                message: `New order #${order.id} from client ${clientId}.`,
                status: false, // New notification status is false (unread)
            },
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error placing order' });
    }
};


// Get all orders for a client
const getClientOrders = async (req, res) => {
    const clientId = req.user.id;

    try {
        const orders = await prisma.order.findMany({
            where: { clientId },
            include: {
                chef: true,
                deliveryBoy: true,
            },
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Get all orders for a chef
const getChefOrders = async (req, res) => {
    const chefId = req.user.id; // Get chef ID from authenticated user

    try {
        const orders = await prisma.order.findMany({
            where: { chefId },
            include: {
                client: true,
            },
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Update order status (for chefs or delivery boys)
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating order status' });
    }
};

// Accept or Reject an Order by Chef
const chefResponseToOrder = async (req, res) => {
    const { orderId } = req.params;
    const { response } = req.body; // `response` can be 'accept' or 'reject'
    const chefId = req.user.id;

    try {
        const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });

        // Ensure that only the chef of this order can respond to it
        if (order.chefId !== chefId) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Update order status based on the chef's response
        const newStatus = response === 'accept' ? 'ACCEPTED_AND_IN_PROGRESS' : 'REJECTED';
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status: newStatus },
        });

        // Update the notification to "viewed" or "read" (optional)
        await prisma.notification.update({
            where: { orderId: Number(orderId) },
            data: { status: true },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing order response' });
    }
};

module.exports = {
    placeOrder,
    getClientOrders,
    getChefOrders,
    updateOrderStatus,
    chefResponseToOrder
};
