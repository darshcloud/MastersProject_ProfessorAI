// Controller file for Student flow

let sequelizeInstance; // Sequelize instance

// Setter function to set the Sequelize instance
function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}

//Controller function to retrieve profile information for a specific student
async function getStudentProfileDetails(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const Student = require('../models/Student')(sequelizeInstance);
        const Course = require('../models/Course')(sequelizeInstance);
        const Enrollment = require('../models/Enrollment')(sequelizeInstance);

        // Fetch the student by studentID including the enrolled courses
        const studentId = req.params.student_id;
        const student = await Student.findByPk(studentId, {
            include: [{
                model: Course,
                through: {
                    model: Enrollment,
                    attributes: []
                },
                attributes: ['course_code', 'course_name']
            }],
            attributes: ['first_name', 'last_name', 'email', 'bio', 'phone_number']
        });

        if (!student) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Send the student profile as a response
        res.json(student);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

//Controller Function to update profile information
async function updateStudentProfileInformation(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const Student = require('../models/Student')(sequelizeInstance);

        const { student_id } = req.params;

        // Extract Bio and Phone Number from request body
        const { bio, phone_number } = req.body;

        // Find the student by studentId
        const student = await Student.findByPk(student_id);

        // If student does not exist, return an error
        if (!student) {
            return res.status(404).json({ message: 'Profile Information not found to Update' });
        }

        // Update the student's profile information
        student.bio = bio;
        student.phone_number = phone_number;

        // Save the changes to the database
        await student.save();

        // Send a success response once saved
        res.json({ message: 'Profile Details updated and saved successfully' });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

//Controller function for retrieving courses enrolled by a student
async function getEnrolledCoursesDetails(req, res){

    const Student = require('../models/Student')(sequelizeInstance);
    const Course = require('../models/Course')(sequelizeInstance);

    try {
        const studentId = req.params.student_id;

        // Find the student and their enrolled courses
        const student = await Student.findByPk(studentId, {
            include: {
                model: Course,
                as: 'Courses',
                through: {
                    attributes: [],
                },
                attributes: ['course_id', 'course_code', 'course_name'],
            },
            attributes: [],
        });

        if (!student) {
            return res.status(404).json({message:'Student not found'});
        }

        // Extract the courses and send them in the response
        const enrolledCourses = student.Courses;

        if(enrolledCourses.length === 0){
            return res.json({ message: "Not Enrolled in any courses at this time" });
        }
        res.json(enrolledCourses);

    } catch (error) {
        console.error('Error fetching courses for student:', error);
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    setSequelize,
    getStudentProfileDetails,
    updateStudentProfileInformation,
    getEnrolledCoursesDetails
}
