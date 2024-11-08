const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//////////////////////////////////// Helper function to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Client Registration with validation
const registerClient = async (req, res) => {
    const { name, email, password, confirmPassword, phone, address, imageUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Validate password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newClient = await prisma.client.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                imageUrl,
            },
        });
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: 'Error creating client' });
    }
};

//////////////////////////////////////////// Chef Registration with validation
const registerChef = async (req, res) => {
    const { name, email, password, confirmPassword, phone, imageUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Validate password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newChef = await prisma.chef.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                imageUrl,
            },
        });
        res.status(201).json(newChef);
    } catch (error) {
        res.status(500).json({ error: 'Error creating chef' });
    }
};

///////////////////////////////// DeliveryBoy Registration with validation
const registerDeliveryBoy = async (req, res) => {
    const { name, email, password, confirmPassword, phone, bio, imageUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Validate password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newDeliveryBoy = await prisma.deliveryBoy.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                bio,
                imageUrl,
            },
        });
        res.status(201).json(newDeliveryBoy);
    } catch (error) {
        res.status(500).json({ error: 'Error creating delivery boy' });
    }
};

/////////////////////////// Admin Registration with validation
const registerAdmin = async (req, res) => {
    const { name, email, password} = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Validate password match
    

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin' });
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for Client
        let user = await prisma.client.findUnique({ where: { email } });
        let userType = 'client';

        if (!user) {
            // Check for Chef
            user = await prisma.chef.findUnique({ where: { email } });
            userType = 'chef';
        }

        if (!user) {
            // Check for DeliveryBoy
            user = await prisma.deliveryBoy.findUnique({ where: { email } });
            userType = 'deliveryBoy';
        }

        if (!user) {
            // Check for Admin
            user = await prisma.admin.findUnique({ where: { email } });
            userType = 'admin';
        }

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, userType }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.json({ 
            token, 
            userType, 
            user: {
                name: user.name,
                imageUrl: user.imageUrl, 
                email: user.email,
                phone: user.phone ,
                id: user.id 
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};


module.exports = {
    registerClient,
    registerChef,
    registerDeliveryBoy,
    registerAdmin,
    login
};
