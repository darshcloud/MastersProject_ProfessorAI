import React, { useState, useEffect } from 'react';
import './professor.css';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useHistory } from 'react-router-dom';
import { Button,Typography } from '@mui/material';
import {useAuth} from "../../context/AuthContext";

const Professor = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const professorId = currentUser?.professor_id;
    const professorName = currentUser?.first_name || "Professor";
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const history = useHistory();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/professor/${professorId}/courses`, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        }}
                );

                if(response.data.length > 0){
                    setCourses(response.data);
                    setErrorMessage('');
                } else {
                    setErrorMessage('You are not registered to any courses at the moment! Please contact admin for assistance');
                }

            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'An unexpected error occurred while retrieving the courses.');
            }
        };

        fetchCourses();
    }, [professorId, backendUrl]);

    const colors = ['#007bff','#FF7F50','#008080'];

    const handleCourseClick = (courseId) => {
        history.push(`/Professor/course/${courseId}`);
    };
      const handleGetEnrolledStudents = () => {
        history.push(`/getenrolledstudents`);
    };

    return (
        <div className="professor-home">
            <div className="content">
                <div className="welcome">
                    <Typography variant="h4">Welcome back Professor. {professorName}! </Typography><br/>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Button variant="contained" color="success" onClick={handleGetEnrolledStudents}>
                            Check Enrolled Students
                        </Button>
                    </div>
                    <Typography variant="h5" align="center">Your list of courses</Typography>
                </div>
                <br/>
                {errorMessage &&  <Alert severity="error" variant="filled">{errorMessage}</Alert>}
                <div className="courses">
                    {courses.map((course, index) => (
                        <div key={course.course_id} className="course" onClick={() => handleCourseClick(course.course_id)}>
                            <h3 style={{ backgroundColor: colors[index % colors.length] }}>{course.course_code}</h3>
                            <p>Course Name: {course.course_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
};

export default Professor;
