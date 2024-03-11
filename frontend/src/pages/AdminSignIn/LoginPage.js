import React, { useState,useEffect } from 'react';

import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });
      
      Cookies.set('token', response.data.token, { expires: 7 }); // Save the token in a cookie
      setLoginSuccess(true); // Update loginSuccess state
      setIsAdmin(true); 
      setIsAuthenticated(true);// Set isAdmin based on the role returned from the backend

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('No response from the server.');
      } else {
        setError('Error: ' + error.message);
      }
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      if (isAdmin && isAuthenticated) {
        history.push('/admin/dashboard', { isAdmin: true }); // Redirect to admin dashboard
      } else {
        // Redirect non-admin users to a different page, or display an error, etc.
        setError('Not authorized as admin.');
      }
    }
  }, [loginSuccess, isAdmin, history, isAuthenticated]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ marginTop: '8rem', padding: '2rem' }}>
        <Typography component="h1" variant="h5" style={{ textAlign: 'center' }}>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit} noValidate style={{ marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" style={{ marginTop: '10px' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '3rem 0 2rem' }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
