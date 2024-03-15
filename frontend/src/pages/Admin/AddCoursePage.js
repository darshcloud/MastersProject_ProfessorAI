import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import axios from 'axios'; // Ensure axios is imported for API calls

function AddCoursePage() {
  const [courseId, setCourseId] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [submissionError, setSubmissionError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCourseDetails(null); // Reset course details on new submission
    setSubmissionError(''); // Reset submission error on new submission

    const courseData = {
      course_id: courseId,
      course_code: courseCode,
      course_name: courseName
    };

    try {
      const response = await axios.post('http://localhost:5000/api/admin/courses', courseData);
      // Set the course details from the response data to display them
      setCourseDetails(response.data);
    } catch (error) {
      console.error('There was an error adding the course:', error);
      setSubmissionError('Error adding course: ' + (error.response?.data?.message || error.message));
    }
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
            id="courseId"
            label="Course ID"
            name="courseId"
            autoFocus
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
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
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Add Course
          </Button>
          {submissionError && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {submissionError}
            </Typography>
          )}
        </form>
        {courseDetails && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Course Added Successfully!
            </Typography>
            <Typography variant="body1">Course ID: {courseDetails.course.course_id}</Typography>
            <Typography variant="body1">Course Code: {courseDetails.course.course_code}</Typography>
            <Typography variant="body1">Course Name: {courseDetails.course_name}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AddCoursePage;
