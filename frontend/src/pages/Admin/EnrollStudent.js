import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Snackbar
} from '@mui/material';
import Cookies from 'js-cookie';

function EnrollStudent() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/students`, { headers }),
          axios.get(`${backendUrl}/api/admin/getallcourses`, { headers })
        ]);

        setStudents(studentsRes.data);
        setCourses(coursesRes.data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbarMessage('Failed to fetch data.');
        setSnackbarOpen(true);
      }
    };

    fetchStudentsAndCourses();
  }, []);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      setSnackbarMessage('Please select a student and a course.');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const token = Cookies.get('token');
      await axios.post(`${backendUrl}/api/admin/student/enroll`, {
        student_id: selectedStudent,
        course_id: selectedCourse
      }, { headers: { Authorization: `Bearer ${token}` } });
  
      setSnackbarMessage('Student enrolled successfully!');
      setSelectedCourse('');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to enroll student.';
      setSnackbarMessage(errorMessage);
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 18, marginBottom:'400px' }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Enroll Student in Course
      </Typography>
      {(!selectedStudent || !selectedCourse) && (
        <Typography color="error" variant="body1" textAlign="center" sx={{ mb: 2 }}>
          Please select a course and a student to proceed.
        </Typography>
      )}
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Student</InputLabel>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              label="Student"
            >
              {students.map((student) => (
                <MenuItem key={student.student_id} value={student.student_id}>
                  {`${student.first_name} ${student.last_name} (${student.email})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Course"
            >
              {courses.map(course => (
                <MenuItem key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            color="success"
            onClick={handleEnroll}
            fullWidth
            sx={{ mt: 1 }}
          >
            Enroll
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default EnrollStudent;
