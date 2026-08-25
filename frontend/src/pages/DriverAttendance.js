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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DriverAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [activeShift, setActiveShift] = useState(null);

  // Define fetchAttendance first (before useEffect)
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/attendance/driver/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data);
      
      // Find active shift
      const active = response.data.find(record => !record.logoutTime);
      setActiveShift(active);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Define fetchVehicles
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

  // Now useEffect can safely call these functions
  useEffect(() => {
    fetchAttendance();
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  const handleStartShift = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/attendance/login', {
        driverId: user.id,
        vehicleId: selectedVehicle,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAttendance();
      setOpen(false);
      setSelectedVehicle(''); // Reset selected vehicle
    } catch (error) {
      console.error('Error starting shift:', error);
    }
  };

  const handleEndShift = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/attendance/logout/${activeShift.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error ending shift:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return 'In Progress';
    const start = new Date(loginTime);
    const end = new Date(logoutTime);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Attendance
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your shifts and working hours
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        {!activeShift ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Start New Shift
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEndShift}
          >
            End Current Shift
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>Logout Time</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {vehicles.find(v => v.id === record.vehicleId)?.registrationNumber || 'Unknown'}
                </TableCell>
                <TableCell>{formatDate(record.loginTime)}</TableCell>
                <TableCell>
                  {record.logoutTime ? formatDate(record.logoutTime) : 'In Progress'}
                </TableCell>
                <TableCell>
                  {calculateDuration(record.loginTime, record.logoutTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Start New Shift</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Vehicle</InputLabel>
            <Select
              value={selectedVehicle}
              label="Select Vehicle"
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStartShift}
            variant="contained"
            disabled={!selectedVehicle}
          >
            Start Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DriverAttendance;