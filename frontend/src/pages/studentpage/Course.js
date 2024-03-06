import React from 'react';
import './course.css'; // Your CSS file for styling
import ChatBot from 'react-simple-chatbot';
const Course = () => {
  const courses = [
    { id: 1, name: 'Course-1', professor: 'Professor Name 1', materials: ['PDF 1', 'PDF 2', 'PDF 3'] },
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
          <h2>Welcome {studentName}! Below are the Course that you have enrolled in:</h2> {/* Text updated to match screenshot */}
        </div>
        <div className="courses">
          {courses.map((course) => (
            <div key={course.id} className="course">
              <h3>{course.name}</h3> {/* Removed class name to simplify, adjust if needed */}
              <p>{course.professor}</p> {/* Added professor name */}
              <div className="material-list">
                {course.materials.map((material, index) => (
                  <div key={index} className="material">
                    <span>{material}</span>
                    <button>Download</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* chatbot comes in this page */}
    </div>
    
  );
};

export default Course;
