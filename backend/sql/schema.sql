DROP DATABASE IF EXISTS professorai;
CREATE DATABASE IF NOT EXISTS professorai;

USE professorai;

CREATE TABLE IF NOT EXISTS students (
                                        student_id INT AUTO_INCREMENT PRIMARY KEY,
                                        first_name VARCHAR(50) NOT NULL,
                                        last_name VARCHAR(50) NOT NULL,
                                        email VARCHAR(100) NOT NULL,
                                        bio VARCHAR(255),
                                        phone_number VARCHAR(20),
                                        user_role VARCHAR(20) NOT NULL

);

CREATE TABLE IF NOT EXISTS professors (
                                          professor_id INT AUTO_INCREMENT PRIMARY KEY,
                                          first_name VARCHAR(50) NOT NULL,
                                          last_name VARCHAR(50) NOT NULL,
                                          email VARCHAR(100) NOT NULL,
                                          bio VARCHAR(255),
                                          phone_number VARCHAR(20),
                                          user_role VARCHAR(20) NOT NULL

);

CREATE TABLE IF NOT EXISTS admins (
                                      admin_id VARCHAR(10) PRIMARY KEY,
                                      first_name VARCHAR(50) NOT NULL,
                                      last_name VARCHAR(50) NOT NULL,
                                      email VARCHAR(100) NOT NULL,
                                      bio VARCHAR(255),
                                      phone_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS courses (
                                       course_id INT AUTO_INCREMENT PRIMARY KEY,
                                       course_code VARCHAR(20) NOT NULL,
                                       course_name VARCHAR(100) NOT NULL,
                                       professor_id INT,
                                       FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);

CREATE TABLE IF NOT EXISTS course_materials (
                                               material_id INT AUTO_INCREMENT PRIMARY KEY,
                                               URI VARCHAR(255) NOT NULL,
                                               file_name VARCHAR(100) NOT NULL,
                                               file_type VARCHAR(100) NOT NULL,
                                               course_id INT,
                                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                               FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
                                            enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
                                            student_id INT NOT NULL,
                                            course_id INT NOT NULL,
                                            FOREIGN KEY (student_id) REFERENCES students(student_id),
                                            FOREIGN KEY (course_id) REFERENCES courses(course_id),
                                            UNIQUE(student_id, course_id)
);