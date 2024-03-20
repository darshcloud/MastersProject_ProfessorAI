import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Snackbar } from '@mui/material';
import Cookies from 'js-cookie';
import {  Paper} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function AssignCourseToProfessor() {
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [assignedCourseIds, setAssignedCourseIds] = useState(new Set());
    const [displayCourses, setDisplayCourses] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchCourses();
        fetchProfessors();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/getallcourses`, {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            const unassignedCourses = response.data.courses.filter(course => !course.professor_id);
            setCourses(unassignedCourses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const fetchProfessors = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/professor`, {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            setProfessors(response.data);
        } catch (error) {
            console.error('Failed to fetch professors:', error);
        }
    };

    const handleCourseChange = (event) => {
        
        const unassignedCourses = courses.filter(course => !assignedCourseIds.has(course.course_id));
        setCourses(unassignedCourses);


        setSelectedCourse(event.target.value);
    };

    const handleProfessorChange = (event) => {
        setSelectedProfessor(event.target.value);
    };

    const assignCourse = async () => {
        if (!selectedCourse || !selectedProfessor) {
            setSnackbarMessage('Please select both a course and a professor.');
            setSnackbarOpen(true);
            return;
        }
        try {
            const response = await axios.put(`${backendUrl}/api/admin/course/${selectedCourse}/assignProfessor`, {
                professor_id: selectedProfessor
            }, {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });

          
            setAssignedCourseIds(new Set(assignedCourseIds.add(selectedCourse)));

            setSelectedCourse('');

            setSnackbarMessage(response.data.message || 'Course assigned successfully!');
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : 'Failed to assign course.';
            setSnackbarMessage(message);
        } finally {
            setSnackbarOpen(true);
        }
    };
   
    
    return (
<Container component="main" maxWidth="sm">
  <Paper elevation={6} style={{ padding: '20px', marginTop: '100px', marginBottom: '100px' }}>
    <Typography component="h1" variant="h5" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <MenuBookIcon color="primary" style={{ marginRight: '8px' }} />
      Assign Course to Professor
    </Typography>
    <div style={{ marginTop: '20px' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={selectedCourse}
          onChange={handleCourseChange}
          variant="outlined"
        >
          {courses.map(course => (
            <MenuItem key={course.course_id} value={course.course_id}>
              {course.course_code} - {course.course_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="professor-select-label">Professor</InputLabel>
        <Select
          labelId="professor-select-label"
          id="professor-select"
          value={selectedProfessor}
          onChange={handleProfessorChange}
          variant="outlined"
        >
          {professors.map(professor => (
            <MenuItem key={professor.professor_id} value={professor.professor_id}>
              {professor.first_name} {professor.last_name} - {professor.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={assignCourse}
        fullWidth
        style={{ marginTop: '20px' }}
      >
        Assign Course
      </Button>
    </div>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
      style={{ zIndex: 1400 }}
    />
  </Paper>
</Container>
    );
}

export default AssignCourseToProfessor;
