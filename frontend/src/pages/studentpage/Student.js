import React, { useState, useEffect } from 'react';
import './student.css';
import Navigation from "./StudentNav";
import axios from 'axios';


const Student = () => {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const studentId = 1; // Replace with actual ID coming from SSO based on login
  const backendUrl=process.env.REACT_APP_BACKEND_URL;

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

        setCourses(response.data);
        setErrorMessage('');
      } catch (error) {
        // catch the error message from backend
        setErrorMessage(error.response?.data?.message || 'An unexpected error occurred while retrieving the courses.');
      }
    };

    fetchCourses();
  }, [studentId, backendUrl]);


  const studentName = "Priscilla Chay Test"; //Need to retrieve student name dynamically from SSO details

  return (
    <div className="dashboard">
      <Navigation />
      <div className="content">
        <div className="welcome">
          <h2>Welcome {studentName}!<br/> Exciting Learning Ahead! Here is your list of enrolled courses.</h2>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="courses">
          {courses.map((course) => (
            <div key={course.course_id} className="course">
              <h3>{course.course_code}</h3>
              <p>Course Name: {course.course_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Student;
