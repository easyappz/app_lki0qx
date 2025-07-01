import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Box, Paper } from '@mui/material';
import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get('/api/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (selectedChat) {
      try {
        const response = await axios.get(`/api/messages/${selectedChat}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChat) {
      try {
        await axios.post(`/api/messages/${selectedChat}`, { content: newMessage });
        setNewMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      <Box display="flex" gap={2}>
        <Paper elevation={3} sx={{ width: '30%', height: '400px', overflowY: 'auto', p: 2 }}>
          <Typography variant="h6" gutterBottom>Chats</Typography>
          <List>
            {chats.map((chat) => (
              <ListItem
                key={chat._id}
                button
                onClick={() => setSelectedChat(chat._id)}
                selected={selectedChat === chat._id}
              >
                <ListItemText primary={chat.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ width: '70%' }}>
          <Paper elevation={3} sx={{ height: '300px', overflowY: 'auto', p: 2, mb: 2 }}>
            <List>
              {messages.map((message) => (
                <ListItem key={message._id}>
                  <ListItemText
                    primary={message.sender.username}
                    secondary={message.content}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Box component="form" onSubmit={handleSendMessage} noValidate sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              id="message"
              label="Type a message"
              name="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" type="submit" disabled={!selectedChat}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Messages;