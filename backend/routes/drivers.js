const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { readData, writeData } = require('../utils/dataUtils');

// Get all drivers
router.get('/', (req, res) => {
    try {
        const drivers = readData('drivers.json');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching drivers' });
    }
});

// Get single driver
router.get('/:id', (req, res) => {
    try {
        const drivers = readData('drivers.json');
        const driver = drivers.find(d => d.id === req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching driver' });
    }
});

// Create driver
router.post('/', (req, res) => {
    try {
        const drivers = readData('drivers.json');
        const { name, email, password, phone, licenseNumber } = req.body;
        
        if (drivers.find(d => d.email === email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newDriver = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            phone,
            licenseNumber,
            createdAt: new Date().toISOString()
        };

        drivers.push(newDriver);
        writeData('drivers.json', drivers);
        res.status(201).json(newDriver);
    } catch (error) {
        res.status(500).json({ message: 'Error creating driver' });
    }
});

// Update driver
router.put('/:id', (req, res) => {
    try {
        const drivers = readData('drivers.json');
        const index = drivers.findIndex(d => d.id === req.params.id);
        
        if (index === -1) return res.status(404).json({ message: 'Driver not found' });

        const { name, email, phone, licenseNumber } = req.body;
        drivers[index] = {
            ...drivers[index],
            name,
            email,
            phone,
            licenseNumber,
            updatedAt: new Date().toISOString()
        };

        writeData('drivers.json', drivers);
        res.json(drivers[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating driver' });
    }
});

// Delete driver
router.delete('/:id', (req, res) => {
    try {
        const drivers = readData('drivers.json');
        const filteredDrivers = drivers.filter(d => d.id !== req.params.id);
        
        if (filteredDrivers.length === drivers.length) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        writeData('drivers.json', filteredDrivers);
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting driver' });
    }
});

module.exports = router; 