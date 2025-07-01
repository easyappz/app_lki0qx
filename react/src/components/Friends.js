import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

const Friends = () => {
  const friends = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend.id}>
            <ListItemAvatar>
              <Avatar>{friend.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Friends;
