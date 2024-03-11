import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

function AddCoursePage() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your logic to submit these values to your backend here
    console.log({ courseName, courseDescription });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography component="h1" variant="h5">
          Add New Course
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="courseName"
            label="Course Name"
            name="courseName"
            autoFocus
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="courseDescription"
            label="Course Description"
            name="courseDescription"
            multiline
            rows={4}
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Add Course
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AddCoursePage;
