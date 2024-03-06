import React from 'react';
import './student.css'; // Your CSS file for styling


const Student = () => {
  const courses = [
    { id: 1, name: 'Course-1', professor: 'Professor Name 1'},
    { id: 2, name: 'Course-2', professor: 'Professor Name 2'},
    { id: 3, name: 'Course-3', professor: 'Professor Name 3'}
  ];

  const studentName = "Student Name"; // Replace with actual data source

  return (
    <div className="dashboard">
      <div className="header">
        <button>Student Home</button> {/* Changed text to match screenshot */}
        <div className="right-menu">
          <button>View profile</button>
          {/*<button>Logout</button>*/}
        </div>
      </div>
      <div className="content">
        <div className="welcome">
          <h2>Welcome {studentName}! Below are the Courses that you have enrolled in:</h2> {/* Text updated to match screenshot */}
        </div>
        <div className="courses">
          {courses.map((course) => (
            <div key={course.id} className="course">
              <h3>{course.name}</h3> {/* Removed class name to simplify, adjust if needed */}
              <p>Professor: {course.professor}</p> {/* Added professor name */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Student;
