import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Snackbar } from '@mui/material';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/users/search?q=${searchTerm}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setSnackbar({ open: true, message: 'Error searching users' });
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post('/friends/request', { receiverId: userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSnackbar({ open: true, message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Error sending friend request:', error);
      setSnackbar({ open: true, message: 'Error sending friend request' });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Search Users
      </Typography>
      <Box component="form" onSubmit={handleSearch} noValidate sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          id="search"
          label="Search users"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>
      <List>
        {searchResults.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar>{user.username[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.username} secondary={user.email} />
            <Button onClick={() => sendFriendRequest(user._id)} variant="outlined">
              Add Friend
            </Button>
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default Search;