import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.email}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Fleet Management System Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {user?.role === 'admin' && (
          <>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <CarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Vehicle Management
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your fleet vehicles, track maintenance, and monitor vehicle status.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/vehicles')}
                  sx={{ mt: 2 }}
                >
                  View Vehicles
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <TimeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Attendance Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Monitor driver attendance and working hours.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/attendance')}
                  sx={{ mt: 2 }}
                >
                  View Attendance
                </Button>
              </Paper>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <TimeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              My Attendance
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Log your attendance and track your working hours.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/driver-attendance')}
              sx={{ mt: 2 }}
            >
              View My Attendance
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 