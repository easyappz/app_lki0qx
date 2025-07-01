import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h6">Username: JohnDoe</Typography>
          <Typography variant="body1">Email: john@example.com</Typography>
          <Typography variant="body1">Bio: This is a sample bio.</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
