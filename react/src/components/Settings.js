import React from 'react';
import { Container, Typography, Switch, FormControlLabel, Button, Box } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email notifications"
        />
        <FormControlLabel
          control={<Switch />}
          label="Dark mode"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Two-factor authentication"
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
      >
        Save Settings
      </Button>
    </Container>
  );
};

export default Settings;
