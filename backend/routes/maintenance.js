const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataUtils');

// Get all maintenance records
router.get('/', (req, res) => {
    try {
        const maintenance = readData('maintenance.json');
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance records' });
    }
});

// Get single maintenance record
router.get('/:id', (req, res) => {
    try {
        const maintenance = readData('maintenance.json');
        const record = maintenance.find(m => m.id === req.params.id);
        if (!record) return res.status(404).json({ message: 'Maintenance record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance record' });
    }
});

// Create maintenance record
router.post('/', (req, res) => {
    try {
        const maintenance = readData('maintenance.json');
        const { vehicleId, driverId, type, description, cost, dieselRuntime, deliveryInfo, paymentStatus } = req.body;
        
        const newRecord = {
            id: Date.now().toString(),
            vehicleId,
            driverId,
            type,
            description,
            cost,
            dieselRuntime,
            deliveryInfo,
            paymentStatus,
            createdAt: new Date().toISOString()
        };

        maintenance.push(newRecord);
        writeData('maintenance.json', maintenance);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error creating maintenance record' });
    }
});

// Update maintenance record
router.put('/:id', (req, res) => {
    try {
        const maintenance = readData('maintenance.json');
        const index = maintenance.findIndex(m => m.id === req.params.id);
        
        if (index === -1) return res.status(404).json({ message: 'Maintenance record not found' });

        const { vehicleId, driverId, type, description, cost, dieselRuntime, deliveryInfo, paymentStatus } = req.body;
        maintenance[index] = {
            ...maintenance[index],
            vehicleId,
            driverId,
            type,
            description,
            cost,
            dieselRuntime,
            deliveryInfo,
            paymentStatus,
            updatedAt: new Date().toISOString()
        };

        writeData('maintenance.json', maintenance);
        res.json(maintenance[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating maintenance record' });
    }
});

// Delete maintenance record
router.delete('/:id', (req, res) => {
    try {
        const maintenance = readData('maintenance.json');
        const filteredMaintenance = maintenance.filter(m => m.id !== req.params.id);
        
        if (filteredMaintenance.length === maintenance.length) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        writeData('maintenance.json', filteredMaintenance);
        res.json({ message: 'Maintenance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting maintenance record' });
    }
});

module.exports = router; 