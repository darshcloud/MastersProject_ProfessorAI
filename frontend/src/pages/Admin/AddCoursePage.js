import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function AddCoursePage() {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [submissionError, setSubmissionError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const courseData = {
      course_code: courseCode,
      course_name: courseName
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/courses`, courseData, { headers });
      setCourseDetails(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('There was an error adding the course:', error);
      setSubmissionError('Error adding course: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '100px', marginBottom: '400px' }}>
        <Typography component="h1" variant="h5" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <MenuBookIcon color="primary" style={{ marginRight: '8px' }} />
          Add New Course
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="courseCode"
            label="Course Code"
            name="courseCode"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="courseName"
            label="Course Name"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="success" style={{ marginTop: '20px' }}>
            Add Course
          </Button>
          {submissionError && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {submissionError}
            </Typography>
          )}
        </form>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Course Added Successfully</DialogTitle>
        <DialogContent>
          <Typography>Course Code: {courseDetails?.course.course_code}</Typography>
          <Typography>Course Name: {courseDetails?.course.course_name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AddCoursePage;
