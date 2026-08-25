import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MaintenanceManagement = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    type: '',
    description: '',
    cost: '',
    dieselRuntime: '',
    deliveryInfo: '',
    paymentStatus: 'pending',
  });

  useEffect(() => {
    fetchMaintenance();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/maintenance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaintenance(response.data);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleOpen = (record = null) => {
    if (record) {
      setSelectedMaintenance(record);
      setFormData({
        vehicleId: record.vehicleId,
        driverId: record.driverId,
        type: record.type,
        description: record.description,
        cost: record.cost,
        dieselRuntime: record.dieselRuntime,
        deliveryInfo: record.deliveryInfo,
        paymentStatus: record.paymentStatus,
      });
    } else {
      setSelectedMaintenance(null);
      setFormData({
        vehicleId: '',
        driverId: '',
        type: '',
        description: '',
        cost: '',
        dieselRuntime: '',
        deliveryInfo: '',
        paymentStatus: 'pending',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMaintenance(null);
    setFormData({
      vehicleId: '',
      driverId: '',
      type: '',
      description: '',
      cost: '',
      dieselRuntime: '',
      deliveryInfo: '',
      paymentStatus: 'pending',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (selectedMaintenance) {
        await axios.put(
          `http://localhost:5000/api/maintenance/${selectedMaintenance.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/maintenance',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchMaintenance();
      handleClose();
    } catch (error) {
      console.error('Error saving maintenance:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/maintenance/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMaintenance();
      } catch (error) {
        console.error('Error deleting maintenance:', error);
      }
    }
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})` : '';
  };

  const getDriverInfo = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : '';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Maintenance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Maintenance Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Diesel Runtime</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{getVehicleInfo(record.vehicleId)}</TableCell>
                <TableCell>{getDriverInfo(record.driverId)}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>${record.cost}</TableCell>
                <TableCell>{record.dieselRuntime} hours</TableCell>
                <TableCell>{record.paymentStatus}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(record)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(record.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedMaintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Vehicle</InputLabel>
              <Select
                value={formData.vehicleId}
                label="Vehicle"
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Driver</InputLabel>
              <Select
                value={formData.driverId}
                label="Driver"
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                required
              >
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Type"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />

            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <TextField
              margin="dense"
              label="Cost"
              type="number"
              fullWidth
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />

            <TextField
              margin="dense"
              label="Diesel Runtime (hours)"
              type="number"
              fullWidth
              value={formData.dieselRuntime}
              onChange={(e) => setFormData({ ...formData, dieselRuntime: e.target.value })}
              required
            />

            <TextField
              margin="dense"
              label="Delivery Info"
              fullWidth
              value={formData.deliveryInfo}
              onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={formData.paymentStatus}
                label="Payment Status"
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedMaintenance ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MaintenanceManagement; 