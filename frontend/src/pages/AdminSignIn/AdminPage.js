import React from 'react';
import { Button, Container, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function AdminPage() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem',  height: '600px' }} >
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={10} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Course Management
            </Typography>
            <Button
            variant="contained"
            color="primary"
            style={{ marginRight: '1rem' }}
            component={Link}
            to={{
                pathname: "/add-course",
                state: { isAdmin: true }
            }}
            >
            Add Course
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Professor Management
            </Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} component={Link} to="/add-course">
              Add Course
            </Button>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} component={Link} to="/add-course">
              Add Course
            </Button>
            {/* Additional professor management functionality as needed */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Student Management
            </Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} component={Link} to="/add-course">
              Add Course
            </Button>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} component={Link} to="/add-course">
              Add Course
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>

  );
}

export default AdminPage;
