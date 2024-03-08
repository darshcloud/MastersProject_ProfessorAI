import React, { useState, useEffect } from 'react';
import './student.css';
import Navigation from "./StudentNav";
import axios from 'axios';
import Alert from '@mui/material/Alert';


const Student = () => {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const studentId = 1; // Replace with actual ID coming from SSO based on login
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
            `${backendUrl}/api/student/${studentId}/courses`, {
              headers: {
                'Content-Type': 'application/json',
                //'Authorization' : `token ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*"
              }}
        );

        if(response.data.length > 0){
          setCourses(response.data);
          setErrorMessage('');
        } else {
          setErrorMessage('You are not enrolled in any courses at the moment!');
        }

      } catch (error) {
        // catch the error message from backend
        setErrorMessage(error.response?.data?.message || 'An unexpected error occurred while retrieving the courses.');
      }
    };

    fetchCourses();
  }, [studentId, backendUrl]);


  const studentName = "Priscilla Chay Test"; //Need to retrieve student name dynamically from SSO details
  const colors = ['#007bff','#FF7F50','#008080'];

  return (
    <div className="home">
      <Navigation />
      <div className="content">
        <div className="welcome">
          <h2>Welcome {studentName}!<br/> Exciting Learning Ahead! Here is your list of enrolled courses.</h2>
        </div>
        {errorMessage &&  <Alert severity="error" variant="filled">{errorMessage}</Alert>}
        <div className="courses">
          {courses.map((course, index) => (
            <div key={course.course_id} className="course">
              <h3 style={{ backgroundColor: colors[index % colors.length] }}>{course.course_code}</h3>
              <p>Course Name: {course.course_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Student;
