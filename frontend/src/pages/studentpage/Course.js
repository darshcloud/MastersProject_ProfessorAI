import React from 'react';
import './course.css';
const Course = () => {
  const courses = [
    { id: 1, name: 'Course-1', professor: 'Professor Name 1', materials: ['PDF 1', 'PDF 2', 'PDF 3'] },
  ];


  return (
    <div className="dashboard">
      <div className="content">
        <div className="welcome">
          <h2>Your selected course comes with the following list of course materials.</h2> {/* Text updated to match screenshot */}
        </div>
        <div className="courses">
          {courses.map((course) => (
            <div key={course.id} className="course">
              <h3>{course.name}</h3>
              <p>{course.professor}</p>
              <div className="material-list">
                {course.materials.map((material, index) => (
                  <div key={index} className="material">
                    <span>{material}</span>
                    <button>View Material</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default Course;
