let sequelizeInstance; 

function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}
async function registerUser(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }
        const { first_name, last_name, email, bio, phone_number, user_role } = req.body;
        if (user_role !== 'professor' && user_role !== 'student') {
            return res.status(400).json({ message: "Invalid role. Role should be either 'professor' or 'student'." });
        }
        if (!first_name || !last_name || !email || !first_name.trim() || !last_name.trim() || !email.trim()) {
            return res.status(400).json({ message: "All fields (first name, last name, email) are required and cannot be blank." });
        }
        // Check if the email already exists in either students or professors tables
        const ProfessorModel = require('../models/Professor')(sequelizeInstance);
        const StudentModel = require('../models/Student')(sequelizeInstance);

        const existingProfessor = await ProfessorModel.findOne({ where: { email: email } });
        const existingStudent = await StudentModel.findOne({ where: { email: email } });

        if (existingProfessor || existingStudent) {
            return res.status(400).json({ message: "Email already exists. Please use a different email." });
        }

        let Model, userAttributes;
        if (user_role === 'professor') {
            Model = ProfessorModel;
            userAttributes = {
                first_name,
                last_name,
                email,
                bio: bio || null, 
                phone_number: phone_number || null, 
                user_role: 'professor'
            };
        } else { 
            Model = StudentModel;
            userAttributes = {
                first_name,
                last_name,
                email,
                bio: bio || null,
                phone_number: phone_number || null,
                user_role: 'student'
            };
        }

        const newUser = await Model.create(userAttributes);

        res.json({ message: "User Registration Successful!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function addNewCourse(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const { course_id, course_code, course_name } = req.body;


        if (!course_id || !course_code || !course_name || !course_id.trim() || !course_code.trim() || !course_name.trim()) {
            return res.status(400).json({ message: "All fields (course_id, course_code, course_name) are required and cannot be blank." });
        }

        let Model, userAttributes;

        Model = require('../models/Course')(sequelizeInstance);
        userAttributes = {
            course_id,
            course_code,
            course_name,
            professor_id:  null, // Explicitly set to null 
        };

        const newCourse = await Model.create(userAttributes);

        res.json({ message: "New Course AddSuccessful!", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function enrollStudent(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const { student_id, course_id } = req.body;

        if (!student_id || !course_id) {
            return res.status(400).json({ message: "Both student_id and course_id are required." });
        }

        const Student = require('../models/Student')(sequelizeInstance);
        const studentExists = await Student.findByPk(student_id);
        if (!studentExists) {
            return res.status(404).json({ message: "Student not found." });
        }

        const Course = require('../models/Course')(sequelizeInstance);
        const courseExists = await Course.findByPk(course_id);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found." });
        }

        const Enrollment = require('../models/Enrollment')(sequelizeInstance);
        const existingEnrollment = await Enrollment.findOne({ where: { student_id, course_id } });

        if (existingEnrollment) {
            return res.status(409).json({ message: "The student is already enrolled in this course." });
        }

        const newEnrollment = await Enrollment.create({ student_id, course_id });
        res.json({ message: "Student enrolled successfully.", enrollment: newEnrollment });
    } catch (error) {
        console.error("Error enrolling student in course:", error);
        res.status(500).json({ message: error.message });
    }
}
async function updateStudent(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        // Get student_id from request parameters
        const { student_id } = req.params;

        // Fetch the student with the provided student_id from the database
        const Student = require('../models/Student')(sequelizeInstance);
        let student = await Student.findByPk(student_id);

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Update student details
        const { first_name, last_name, email } = req.body;
        student = await student.update({
            first_name,
            last_name,
            email
        });

        // Send success response with updated student details
        res.json({ message: "Student details updated successfully.", student });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

async function assignProfessor(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        // Get course_id from request parameters
        const { course_id } = req.params;
        // Get course_id from request parameters
        const { professor_id } = req.body;

        // Fetch the student with the provided course_id from the database
        const Course = require('../models/Course')(sequelizeInstance);
        let course = await Course.findByPk(course_id);

        // Check if Course exists
        if (!course) {
            return res.status(404).json({ message: "course not found." });
        }

        // Fetch the student with the provided course_id from the database
        const Professor = require('../models/Professor')(sequelizeInstance);
        let professor = await Professor.findByPk(professor_id);

        // Check if professor exists
        if (!professor) {
            return res.status(404).json({ message: "professor not found." });
        }

        course = await course.update({
            professor_id,
        });

        // Send success response with Assigned for course successfully
        res.json({ message: "Professor Assigned for course successfully.", course });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}
async function updateProfessor(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        // Get professor_id from request parameters
        const { professor_id } = req.params;

        // Fetch the professor with the provided professor_id from the database
        const Professor = require('../models/Professor')(sequelizeInstance);
        let professor = await Professor.findByPk(professor_id);

        // Check if professor exists
        if (!professor) {
            return res.status(404).json({ message: "Professor not found." });
        }

        // Update professor details
        const { first_name, last_name, email } = req.body;
        professor = await professor.update({
            first_name,
            last_name,
            email
        });

        // Send success response with updated professor details
        res.json({ message: "professor details updated successfully.", professor });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

async function deleteStudent(req, res) {
    try {
  
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

   
        const { student_id } = req.params;

        const Student = require('../models/Student')(sequelizeInstance);
        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        await student.destroy();

        res.json({ message: "Student deleted successfully." });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }


}

async function deleteProfessor(req, res) {
    try {
  
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

   
        const { professor_id } = req.params;

        const Professor = require('../models/Professor')(sequelizeInstance);
        const professor = await Professor.findByPk(professor_id);
        console.log(professor)

        if (!professor) {
            return res.status(404).json({ message: "Profesor not found." });
        }
        await professor.destroy();

        res.json({ message: "Profesor deleted successfully." });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }


}
const jwt = require('jsonwebtoken');
 // Secret key for JWT (should be securely managed and not exposed)
const jwtSecretKey = process.env.jwtSecretKey;

// Admin login function
async function adminLogin(req, res) {
    const { email, password } = req.body;

    // Admin credentials (these should be securely stored or managed)
    const adminEmail =  process.env.adminEmail;
    const adminPassword = process.env.adminPassword;
   

    if (email === adminEmail && password === adminPassword) {
        try {
            // Generate JWT token for the admin
            const token = jwt.sign(
                { userId: "admin", email: adminEmail },
                jwtSecretKey,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token: token,
            });
        } catch (error) {
            console.error("JWT Token generation error:", error);
            return res.status(500).json({ message: "Failed to generate token for admin." });
        }
    } else {
        return res.status(401).json({ message: "Invalid admin credentials." });
    }
} 

const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length); // Extract the token from the header

        jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Access denied. Invalid token." });
            } else {
                if (decoded.email === process.env.adminEmail && decoded.userId === "admin") {
                    next(); // The user is an admin, proceed to the next middleware
                } else {
                    return res.status(403).json({ message: "Access denied. Not an admin." });
                }
            }
        });
    } else {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
};


module.exports = {
    setSequelize,
    registerUser,
    enrollStudent,
    updateStudent,
    deleteStudent,
    deleteProfessor,
    updateProfessor,
    addNewCourse,
    assignProfessor,
    adminLogin,
    requireAdmin
};
