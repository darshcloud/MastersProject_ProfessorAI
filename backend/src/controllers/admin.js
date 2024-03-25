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
        const { course_code, course_name } = req.body;
        if (!course_code || !course_name || !course_code.trim() || !course_name.trim()) {
            return res.status(400).json({ message: "Both course_code and course_name are required and cannot be blank." });
        }
        // Check if the Course code or Course name already exists
        const CourseModel = require('../models/Course')(sequelizeInstance);

        const existingCourseCode = await CourseModel.findOne({ where: { course_code: course_code } });
        const existingCourseName = await CourseModel.findOne({ where: { course_name: course_name } });

        if (existingCourseCode || existingCourseName) {
            return res.status(400).json({ message: "Course Code or Course Name Already Exist. Please use a Different Course Code or Name." });
        }

        const Model = require('../models/Course')(sequelizeInstance);

        const userAttributes = {
            course_code,
            course_name,
            professor_id:  null,
        };

        const newCourse = await Model.create(userAttributes);

        res.json({ message: "New Course Added Successfully!", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getAllCourses(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }
        const Course = require('../models/Course')(sequelizeInstance);

        const courses = await Course.findAll();

        res.json({ message: "Courses fetched successfully", courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: error.message });
    }
}

async function deleteCourse(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const { course_id } = req.params;

        // Retrieve all materials for the course
        const CourseMaterial = require('../models/course_material')(sequelizeInstance);
        const materials = await CourseMaterial.findAll({ where: { course_id: course_id } });
        for (const material of materials) {
            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: material.URI,
            };
            try {
                await s3.deleteObject(deleteParams).promise();
                console.log(`Successfully deleted material ${material.URI} from S3`);
                await material.destroy();
                console.log(`Successfully deleted material record for ${material.URI}`);
            } catch (error) {
                console.error(`Error deleting material ${material.URI}:`, error);
            }
        }

        const Enrollment = require('../models/Enrollment')(sequelizeInstance);
        await Enrollment.destroy({ where: { course_id: course_id } });

        const Course = require('../models/Course')(sequelizeInstance);
        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        await course.destroy();

        res.json({ message: "Course and all associated materials and enrollments deleted successfully." });
    } catch (error) {
        console.error("Error deleting course and its associated data:", error);
        res.status(500).json({ message: error.message });
    }
}
async function getAllStudents(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        // Fetch all professors from the database
        const Student = require('../models/Student')(sequelizeInstance); // Initialize Professor model with Sequelize instance
        const students = await Student.findAll();

        // Send the list of professors as a response
        res.json(students);
    } catch (error) {
        // If an error occurs, send an error response
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
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const { course_id } = req.params;
        const { professor_id } = req.body;

        const Course = require('../models/Course')(sequelizeInstance);
        let course = await Course.findByPk(course_id);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // Check if the course is already assigned to a professor
        if (course.professor_id !== null) {
            return res.status(400).json({ message: "Course is already assigned to a professor." });
        }

        const Professor = require('../models/Professor')(sequelizeInstance);
        let professor = await Professor.findByPk(professor_id);

        if (!professor) {
            return res.status(404).json({ message: "Professor not found." });
        }

        // Proceed to assign the course to the professor since it's not already assigned
        await course.update({ professor_id });

        res.json({ message: "Professor assigned to course successfully.", course });
    } catch (error) {
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
        const Enrollment = require('../models/Enrollment')(sequelizeInstance);
        await Enrollment.destroy({ where: { student_id: student_id } });

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
        const Course = require('../models/Course')(sequelizeInstance); 
        const professor = await Professor.findByPk(professor_id);
        console.log(professor)

        if (!professor) {
            return res.status(404).json({ message: "Professor not found." });
        }
        await Course.update({ professor_id: null }, { where: { professor_id: professor_id } });
        await professor.destroy();

        res.json({ message: "Professor deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllProfessorsAndStudents(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }
        const ProfessorModel = require('../models/Professor')(sequelizeInstance);
        const StudentModel = require('../models/Student')(sequelizeInstance);

        const professors = await ProfessorModel.findAll({
            attributes: ['professor_id', 'first_name', 'last_name', 'email', [sequelizeInstance.literal("'professor'"), 'role']]
        });
        const students = await StudentModel.findAll({
            attributes: ['student_id', 'first_name', 'last_name', 'email', [sequelizeInstance.literal("'student'"), 'role']]
        });

        const combinedResults = [
            ...professors.map(professor => ({...professor.get(), id: professor.professor_id})),
            ...students.map(student => ({...student.get(), id: student.student_id}))
        ];

        res.json({ message: "Successfully fetched professors and students", users: combinedResults });
    } catch (error) {
        console.error("Error fetching professors and students:", error);
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
    getAllStudents,
    enrollStudent,
    updateStudent,
    deleteStudent,
    deleteProfessor,
    updateProfessor,
    addNewCourse,
    getAllCourses,
    getAllProfessorsAndStudents,
    deleteCourse,
    assignProfessor,
    adminLogin,
    requireAdmin
};
