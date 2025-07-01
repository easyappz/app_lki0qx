import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import theme from './theme';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Search from './components/Search';
import Friends from './components/Friends';
import Messages from './components/Messages';
import Settings from './components/Settings';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="App">
              <Header />
              <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Box>
              </Container>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;