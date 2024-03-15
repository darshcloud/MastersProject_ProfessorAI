import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import "./AdminLogin.css"; 

import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import Cookies from 'js-cookie';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { checkAdminAuth } = useAuth();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
            Cookies.set('token', data.token, { expires: 7 });
            checkAdminAuth();
            history.push('/admin/dashboard');
            alert('Login successful!');
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
      <Container component="main" maxWidth="xs">
          <Paper elevation={3} style={{ marginTop: '8rem', padding: '2rem' , marginBottom: '200px'}}>
              <Box display="flex" flexDirection="column" alignItems="center">
                  <LockIcon color="primary" style={{ marginBottom: '1rem' }} />
                  <Typography component="h1" variant="h5" style={{ textAlign: 'center' }}>
                      Admin Login
                  </Typography>
              </Box>
              <form onSubmit={handleLogin} noValidate style={{ marginTop: '1rem' }}>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Admin Email"
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
};


export default AdminLogin;
