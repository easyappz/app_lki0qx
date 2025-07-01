import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to MyApp
      </Typography>
      <Typography variant="body1">
        This is the home page of our application.
      </Typography>
    </Container>
  );
};

export default Home;
