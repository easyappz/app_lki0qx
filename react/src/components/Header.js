import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>MyApp</Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ mr: 2 }}>Home</Button>
          <Button color="inherit" component={Link} to="/friends" sx={{ mr: 2 }}>Friends</Button>
          <Button color="inherit" component={Link} to="/messages" sx={{ mr: 2 }}>Messages</Button>
          <Button color="inherit" component={Link} to="/profile" sx={{ mr: 2 }}>Profile</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;