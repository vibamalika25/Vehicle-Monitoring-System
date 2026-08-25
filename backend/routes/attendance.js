const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataUtils');

// Get all attendance records
router.get('/', (req, res) => {
    try {
        const attendance = readData('attendance.json');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance records' });
    }
});

// Get driver's attendance records
router.get('/driver/:driverId', (req, res) => {
    try {
        const attendance = readData('attendance.json');
        const driverAttendance = attendance.filter(a => a.driverId === req.params.driverId);
        res.json(driverAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching driver attendance records' });
    }
});

// Login (start shift)
router.post('/login', (req, res) => {
    try {
        const attendance = readData('attendance.json');
        const { driverId, vehicleId } = req.body;
        
        const activeShift = attendance.find(a => a.driverId === driverId && !a.logoutTime);
        if (activeShift) {
            return res.status(400).json({ message: 'Driver already has an active shift' });
        }

        const newRecord = {
            id: Date.now().toString(),
            driverId,
            vehicleId,
            loginTime: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        attendance.push(newRecord);
        writeData('attendance.json', attendance);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error creating attendance record' });
    }
});

// Logout (end shift)
router.put('/logout/:id', (req, res) => {
    try {
        const attendance = readData('attendance.json');
        const index = attendance.findIndex(a => a.id === req.params.id);
        
        if (index === -1) return res.status(404).json({ message: 'Attendance record not found' });
        if (attendance[index].logoutTime) return res.status(400).json({ message: 'Shift already ended' });

        attendance[index] = {
            ...attendance[index],
            logoutTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        writeData('attendance.json', attendance);
        res.json(attendance[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance record' });
    }
});

module.exports = router; 