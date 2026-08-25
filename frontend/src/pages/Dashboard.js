import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    drivers: 0,
    vehicles: 0,
    maintenance: 0,
    activeShifts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [driversRes, vehiclesRes, maintenanceRes, attendanceRes] = await Promise.all([
          axios.get('http://localhost:5000/api/drivers', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/vehicles', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/maintenance', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/attendance', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        const activeShifts = attendanceRes.data.filter(record => !record.logoutTime).length;

        setStats({
          drivers: driversRes.data.length,
          vehicles: vehiclesRes.data.length,
          maintenance: maintenanceRes.data.length,
          activeShifts,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {icon}
        <Typography variant="h4" component="div" sx={{ mt: 2, color }}>
          {value}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of your fleet management system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <StatCard
          title="Total Drivers"
          value={stats.drivers}
          icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
          color="primary.main"
        />
        <StatCard
          title="Total Vehicles"
          value={stats.vehicles}
          icon={<CarIcon sx={{ fontSize: 40, color: 'success.main' }} />}
          color="success.main"
        />
        <StatCard
          title="Maintenance Records"
          value={stats.maintenance}
          icon={<BuildIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
          color="warning.main"
        />
        <StatCard
          title="Active Shifts"
          value={stats.activeShifts}
          icon={<TimeIcon sx={{ fontSize: 40, color: 'info.main' }} />}
          color="info.main"
        />
      </Grid>
    </Container>
  );
};

export default Dashboard; 