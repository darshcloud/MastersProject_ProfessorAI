import React from 'react';
import './student.css';
import Navigation from "./StudentNav";



const Student = () => {
  const courses = [
    { id: 1, code: 'Course-1', name: 'Course Name 1'},
    { id: 2, code: 'Course-2', name: 'Course Name 2'},
    { id: 3, code: 'Course-3', name: 'Course Name 3'}
  ];

  const studentName = "Student Name";

  return (
    <div className="dashboard">
      <Navigation />
      <div className="content">
        <div className="welcome">
          <h2>Welcome {studentName}!<br/> Exciting Learning Ahead! Here is your list of enrolled courses.</h2>
        </div>
        <div className="courses">
          {courses.map((course) => (
            <div key={course.id} className="course">
              <h3>{course.code}</h3>
              <p>Course Name: {course.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Student;
