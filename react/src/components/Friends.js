import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Snackbar } from '@mui/material';
import axios from 'axios';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/friends', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setSnackbar({ open: true, message: 'Error fetching friends' });
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('/friends/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      setSnackbar({ open: true, message: 'Error fetching friend requests' });
    }
  };

  const handleFriendRequest = async (requestId, status) => {
    try {
      await axios.put(`/friends/request/${requestId}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFriendRequests();
      if (status === 'accepted') fetchFriends();
      setSnackbar({ open: true, message: `Friend request ${status}` });
    } catch (error) {
      console.error('Error handling friend request:', error);
      setSnackbar({ open: true, message: 'Error handling friend request' });
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchFriends();
      setSnackbar({ open: true, message: 'Friend removed successfully' });
    } catch (error) {
      console.error('Error removing friend:', error);
      setSnackbar({ open: true, message: 'Error removing friend' });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Friends
      </Typography>
      <Typography variant="h6" gutterBottom>
        Friend Requests
      </Typography>
      <List>
        {friendRequests.map((request) => (
          <ListItem key={request._id}>
            <ListItemAvatar>
              <Avatar>{request.sender.username[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={request.sender.username} />
            <Button onClick={() => handleFriendRequest(request._id, 'accepted')} variant="contained" color="primary" sx={{ mr: 1 }}>
              Accept
            </Button>
            <Button onClick={() => handleFriendRequest(request._id, 'rejected')} variant="outlined" color="secondary">
              Reject
            </Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        My Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend._id}>
            <ListItemAvatar>
              <Avatar>{friend.username[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
            <Button onClick={() => removeFriend(friend._id)} variant="outlined" color="secondary">
              Remove
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

export default Friends;