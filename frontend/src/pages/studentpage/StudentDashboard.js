import React from 'react';
import './StudentDashboard.css'; // Ensure this CSS file exists and is correctly linked

const StudentDashboard = () => {
  const courses = [
    { id: 1, name: 'Course 1', professorEmail: 'professor1@example.com' },
    { id: 2, name: 'Course 2', professorEmail: 'professor2@example.com' },
    { id: 3, name: 'Course 3', professorEmail: 'professor3@example.com' },
  ];

  // You can replace these details with actual data
  const studentDetails = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    id: '123456',
  };

  return (
    <div className="dashboard">
      <div className="header">
        <button className="home-button">Student Home</button>
        <button className="logout-button">Logout</button>
      </div>
      <div className="content">
        <div className="sub-content"> {/* This container will hold both content1 and content2 side by side */}
          <div className="content1">
            <h2>Enrolled courses</h2>
            {courses.map(course => (
              <div key={course.id} className="course">
                <h3>{course.name}</h3>
                <p>{course.professorEmail}</p>
              </div>
            ))}
          </div>
          <div className="content2">
            <h2>Student details</h2>
            <div className="student-info">
              <p><strong>Name:</strong> {studentDetails.name}</p>
              <p><strong>Email:</strong> {studentDetails.email}</p>
              <p><strong>ID:</strong> {studentDetails.id}</p>
            </div>
            <button>Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
