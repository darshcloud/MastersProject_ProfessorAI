import React from 'react';
import { Button, Container, Typography, Grid, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

function AdminPage() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Course Management
            </Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} component={Link} to="/add-course">
              Add Course
            </Button>
            {/* Add more buttons or inputs as needed for course management */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Professor Management
            </Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }}>
              Add Professor
            </Button>
            <Button variant="contained" color="secondary">
              Remove Professor
            </Button>
            {/* Additional professor management functionality as needed */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Student Management
            </Typography>
            <List component="nav" aria-label="mailbox folders">
              {/* List items can be dynamic based on actual data */}
              <ListItem button>
                <ListItemText primary="Manage Student 1" />
              </ListItem>
              <Divider />
              <ListItem button divider>
                <ListItemText primary="Manage Student 2" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Manage Student 3" />
              </ListItem>
              {/* Add more students as needed */}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPage;
