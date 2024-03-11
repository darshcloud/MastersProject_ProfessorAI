import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import AdminPage from './AdminPage'; // Ensure this path is correct

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

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

  if (loginSuccess) {
    return <AdminPage />;
  }

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
