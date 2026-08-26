const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { readData, writeData } = require('./utils/dataUtils');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: 'https://vehicle-monitoring-system-1.onrender.com',
  credentials: true
}));
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ensure default admin exists
const ensureDefaultAdmin = () => {
    const admins = readData('admins.json');
    if (!admins.find(admin => admin.email === 'admin@example.com')) {
        const hashedPassword = bcrypt.hashSync('admin', 10);
        const defaultAdmin = {
            id: Date.now().toString(),
            name: 'Default Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        admins.push(defaultAdmin);
        writeData('admins.json', admins);
        console.log('Default admin created with email: admin@example.com and password: admin');
    }
};

// Call the function to ensure default admin exists
ensureDefaultAdmin();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Routes
const driversRouter = require('./routes/drivers');
const vehiclesRouter = require('./routes/vehicles');
const maintenanceRouter = require('./routes/maintenance');
const attendanceRouter = require('./routes/attendance');

// Public routes
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const dataFile = role === 'admin' ? 'admins.json' : 'drivers.json';
    const users = readData(dataFile);
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role } });
});

app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const dataFile = role === 'admin' ? 'admins.json' : 'drivers.json';
    const users = readData(dataFile);

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(dataFile, users);
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    const admins = readData('admins.json');
    const admin = admins.find(a => a.email === email);

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    const resetToken = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email' });
        }
        res.json({ message: 'Password reset email sent' });
    });
});

app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const admins = readData('admins.json');
        const adminIndex = admins.findIndex(a => a.id === decoded.id);

        if (adminIndex === -1) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admins[adminIndex].password = bcrypt.hashSync(newPassword, 10);
        writeData('admins.json', admins);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Protected routes
app.use('/api/drivers', authenticateToken, isAdmin, driversRouter);
app.use('/api/vehicles', authenticateToken, isAdmin, vehiclesRouter);
app.use('/api/maintenance', authenticateToken, isAdmin, maintenanceRouter);
app.use('/api/attendance', authenticateToken, attendanceRouter);

// Serve static files from the React app
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        const indexPath = path.join(buildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            console.error("Error: 'index.html' file is missing in the build directory.");
            res.status(404).send("Error: 'index.html' file is missing. Please rebuild the frontend.");
        }
    });
} else {
    console.error("Error: Frontend build directory not found. Please run 'npm run build:frontend' first.");
    app.get('*', (req, res) => {
        res.status(404).send("Frontend build directory not found. Please build the frontend.");
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
    });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Fleet Management System server running on port ${PORT}`);
});
