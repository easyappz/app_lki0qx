import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const EditProfile = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Profile
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          defaultValue="JohnDoe"
        />
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          defaultValue="john@example.com"
        />
        <TextField
          margin="normal"
          fullWidth
          id="bio"
          label="Bio"
          name="bio"
          multiline
          rows={4}
          defaultValue="This is a sample bio."
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;
