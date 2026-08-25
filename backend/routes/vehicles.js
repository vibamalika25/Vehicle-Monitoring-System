const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataUtils');

// Get all vehicles
router.get('/', (req, res) => {
    try {
        const vehicles = readData('vehicles.json');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles' });
    }
});

// Get single vehicle
router.get('/:id', (req, res) => {
    try {
        const vehicles = readData('vehicles.json');
        const vehicle = vehicles.find(v => v.id === req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicle' });
    }
});

// Create vehicle
router.post('/', (req, res) => {
    try {
        const vehicles = readData('vehicles.json');
        const { make, model, year, registrationNumber, type, status } = req.body;
        
        if (vehicles.find(v => v.registrationNumber === registrationNumber)) {
            return res.status(400).json({ message: 'Registration number already exists' });
        }

        const newVehicle = {
            id: Date.now().toString(),
            make,
            model,
            year,
            registrationNumber,
            type,
            status,
            createdAt: new Date().toISOString()
        };

        vehicles.push(newVehicle);
        writeData('vehicles.json', vehicles);
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle' });
    }
});

// Update vehicle
router.put('/:id', (req, res) => {
    try {
        const vehicles = readData('vehicles.json');
        const index = vehicles.findIndex(v => v.id === req.params.id);
        
        if (index === -1) return res.status(404).json({ message: 'Vehicle not found' });

        const { make, model, year, registrationNumber, type, status } = req.body;
        vehicles[index] = {
            ...vehicles[index],
            make,
            model,
            year,
            registrationNumber,
            type,
            status,
            updatedAt: new Date().toISOString()
        };

        writeData('vehicles.json', vehicles);
        res.json(vehicles[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle' });
    }
});

// Delete vehicle
router.delete('/:id', (req, res) => {
    try {
        const vehicles = readData('vehicles.json');
        const filteredVehicles = vehicles.filter(v => v.id !== req.params.id);
        
        if (filteredVehicles.length === vehicles.length) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        writeData('vehicles.json', filteredVehicles);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle' });
    }
});

module.exports = router; 