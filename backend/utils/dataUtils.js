const fs = require('fs');
const path = require('path');

class DataUtils {
    constructor() {
        this.dataPath = path.join(__dirname, '../data');
        this.dataFiles = {
            admins: 'admins.json',
            drivers: 'drivers.json',
            vehicles: 'vehicles.json',
            maintenance: 'maintenance.json',
            attendance: 'attendance.json'
        };
        this.initializeDataFiles();
    }

    initializeDataFiles() {
        if (!fs.existsSync(this.dataPath)) {
            fs.mkdirSync(this.dataPath);
        }

        Object.values(this.dataFiles).forEach(file => {
            const filePath = path.join(this.dataPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([]));
            }
        });
    }

    readData(file) {
        const filePath = path.join(this.dataPath, file);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    writeData(file, data) {
        const filePath = path.join(this.dataPath, file);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
}

// Create a single instance
const dataUtils = new DataUtils();

// Export the instance methods
module.exports = {
    readData: (file) => dataUtils.readData(file),
    writeData: (file, data) => dataUtils.writeData(file, data)
}; 