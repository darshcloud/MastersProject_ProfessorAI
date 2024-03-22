import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Grid, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar
} from '@mui/material';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';

function RemoveUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllProfessorsAndStudents`, { headers });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenConfirmDialog = (user) => {
    setUserToRemove(user);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToRemove(null);
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) {
      console.error("User to remove is not defined.");
      setSnackbarMessage("Failed to remove user: User is undefined.");
      setSnackbarOpen(true);
      return;
    }

    const token = Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };
  
    const endpoint = userToRemove.role === 'professor' ? `/admin/professor/${userToRemove.id}` : `/admin/student/${userToRemove.id}`;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api${endpoint}`, { headers });
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userToRemove.id));
      setSnackbarMessage("User removed successfully.");
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error(`Failed to remove the user:`, error);
      setSnackbarMessage("Failed to remove the user.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const getFilteredUsers = (role) => {
    return users.filter(user =>
      user.role === role &&
      (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }


  return (
    <Container maxWidth="lg" component="main">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '30px', marginBottom:'200px' }}>
        <Typography variant="h4" gutterBottom align="center">
          List of Professors and Students
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="search"
          label="Search Users"
          name="search"
          autoComplete="off"
          autoFocus
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Professors</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredUsers('professor').map((user, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 ? '#f5f5f5' : 'transparent' }}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => handleOpenConfirmDialog(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Students</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredUsers('student').map((user, index) => (
                  <TableRow key={index} style={{ backgroundColor: index % 2 ? '#f5f5f5' : 'transparent' }}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => handleOpenConfirmDialog(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {userToRemove?.first_name} {userToRemove?.last_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleRemoveUser} color="error">Remove</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default RemoveUser;
