import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const GetEnrolledStudents = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser?.professor_id) return;

      try {
        const response = await axios.get(`${backendUrl}/api/professor/${currentUser.professor_id}/courses`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
          }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [currentUser, backendUrl]);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/professor/students/list/${selectedCourse}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
          }
        });
        setStudents(response.data.enrolledStudents || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [selectedCourse, backendUrl]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', marginBottom: '400px' }}>
      <Typography variant="h4" gutterBottom>Students List</Typography>
      <FormControl fullWidth style={{ margin: '20px 0' }}>
        <Select
          value={selectedCourse}
          onChange={handleCourseChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" disabled>Select a Course</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.course_id} value={course.course_id}>{course.course_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {!selectedCourse ? (
        <Typography>Please select a course to view the students enrolled.</Typography>
      ) : students.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.first_name} {student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone_number || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No students enrolled in this course.</Typography>
      )}
    </div>
  );
};

export default GetEnrolledStudents;
