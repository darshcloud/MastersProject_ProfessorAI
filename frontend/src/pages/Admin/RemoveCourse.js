import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get(`${backendUrl}/api/admin/getallcourses`, { headers });
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [backendUrl]);

  const handleRemoveClick = (courseId) => {
    setCourseToRemove(courseId);
    setOpenDialog(true);
  };

  const removeCourse = async () => {
    const token = Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${backendUrl}/api/admin/deletecourse/${courseToRemove}`, { headers });
      setCourses(courses.filter(course => course.course_id !== courseToRemove));
      setOpenDialog(false); 
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCourseToRemove(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', marginBottom: '20px' }}>
      <Typography variant="h4" gutterBottom>Courses List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.course_id}>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.course_code}</TableCell>
                <TableCell align="right">
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleRemoveClick(course.course_id)}
                  >
                    Remove Course
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove Course"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this course? It removes all the enrollments and course material.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={removeCourse} autoFocus color="error">
            I'm Sure
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursesList;
