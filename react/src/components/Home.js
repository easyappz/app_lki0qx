import React from 'react';
import { Typography, Card, CardContent, Grid } from '@mui/material';

const Home = () => {
  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to MyApp
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Connect with Friends
              </Typography>
              <Typography variant="body1">
                Find and connect with friends from all around the world.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Share Your Moments
              </Typography>
              <Typography variant="body1">
                Post updates, photos, and stories to share with your network.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Stay Connected
              </Typography>
              <Typography variant="body1">
                Send messages and stay in touch with your friends and family.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;