import React, { useState, useEffect } from 'react';
import { Container, Typography, Switch, FormControlLabel, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    twoFactorAuth: true
  });
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSettings();
    fetchNotifications();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/user/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({ ...settings, [setting]: event.target.checked });
  };

  const saveSettings = async () => {
    try {
      await axios.post('/api/user/settings', settings);
      setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({ open: true, message: 'Error saving settings', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={handleSettingChange('emailNotifications')}
            />
          }
          label="Email notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.darkMode}
              onChange={handleSettingChange('darkMode')}
            />
          }
          label="Dark mode"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.twoFactorAuth}
              onChange={handleSettingChange('twoFactorAuth')}
            />
          }
          label="Two-factor authentication"
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={saveSettings}
      >
        Save Settings
      </Button>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Notifications
      </Typography>
      {notifications.map((notification, index) => (
        <Alert severity="info" key={index} sx={{ mb: 1 }}>
          {notification.message}
        </Alert>
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;