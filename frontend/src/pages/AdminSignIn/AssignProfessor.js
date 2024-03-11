import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper, MenuItem } from '@mui/material';
import axios from 'axios';

function AssignProfessor() {
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoursesAndProfessors = async () => {
      try {
        const coursesResponse = await axios.get('http://localhost:5000/api/courses');
        const professorsResponse = await axios.get('http://localhost:5000/api/professors');
        setCourses(coursesResponse.data);
        setProfessors(professorsResponse.data);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };
    fetchCoursesAndProfessors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpdateSuccess(false);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/courses/${selectedCourse}`, {
        professorId: selectedProfessor
      });
      setUpdateSuccess(true);
    } catch (error) {
      setError('Failed to update course');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography component="h1" variant="h5">
          Assign Professor to Course
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            select
            label="Select Course"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            required
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select Professor"
            value={selectedProfessor}
            onChange={e => setSelectedProfessor(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            required
          >
            {professors.map((professor) => (
              <MenuItem key={professor.id} value={professor.id}>
                {professor.name}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Assign Professor
          </Button>
          {updateSuccess && (
            <Typography color="primary" style={{ marginTop: '20px' }}>
              Professor assigned successfully!
            </Typography>
          )}
          {error && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
}

export default AssignProfessor;
