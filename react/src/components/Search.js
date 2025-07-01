import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Search = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Search Users
      </Typography>
      <Box component="form" noValidate sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          id="search"
          label="Search users"
          name="search"
          sx={{ mr: 1 }}
        />
        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>
      <Typography variant="body1">
        Search results will be displayed here.
      </Typography>
    </Container>
  );
};

export default Search;
