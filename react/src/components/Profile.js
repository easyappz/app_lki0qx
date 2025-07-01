import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h6">Username: {profile.username}</Typography>
          <Typography variant="body1">Email: {profile.email}</Typography>
          <Typography variant="body1">First Name: {profile.firstName}</Typography>
          <Typography variant="body1">Last Name: {profile.lastName}</Typography>
          <Typography variant="body1">Bio: {profile.bio}</Typography>
        </Box>
      </Paper>
      <Box mt={2}>
        <Button component={Link} to="/edit-profile" variant="contained" color="primary">
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
