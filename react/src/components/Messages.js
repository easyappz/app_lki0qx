import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Box } from '@mui/material';

const Messages = () => {
  const messages = [
    { id: 1, sender: 'Alice', content: 'Hey, how are you?' },
    { id: 2, sender: 'You', content: 'I'm good, thanks! How about you?' },
    { id: 3, sender: 'Alice', content: 'Doing great! Want to meet up later?' },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      <List sx={{ height: '300px', overflowY: 'auto', bgcolor: 'background.paper' }}>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={message.sender}
              secondary={message.content}
            />
          </ListItem>
        ))}
      </List>
      <Box component="form" noValidate sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          id="message"
          label="Type a message"
          name="message"
          sx={{ mr: 1 }}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default Messages;
