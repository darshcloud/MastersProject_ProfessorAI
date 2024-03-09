import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './student.css';

const Student = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [courses, setCourses] = useState([]); // State to hold courses data

  const studentName = currentUser?.first_name || "Student";
  const studentId = currentUser?.student_id; 

  useEffect(() => {
    const fetchCourses = async () => {
      if (studentId) { 
        try {
          const response = await fetch(`http://localhost:5000/api/student/${studentId}/courses`, {
            method: 'GET',
            credentials: 'include', // Necessary for cookies-based auth
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCourses(data); 
            console.log(data)
          } else {
            console.error('Failed to fetch courses');
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [studentId]);
  return (
    <div className="dashboard">
      <div className="content">
        <div className="welcome">
          <h2>Welcome {studentName}!</h2>
        </div>
        <div className="courses">
          {courses.length > 0 ? courses.map((course) => (
            <div key={course.course_code} className="course">
              <h3>{course.course_name}</h3>
              <p>Course code: {course.course_code}</p>
            </div>
          )) : <p>No courses enrolled.</p>}
        </div>
      </div>
    </div>
  );
};

export default Student;
