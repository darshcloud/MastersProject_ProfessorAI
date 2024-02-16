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


module.exports = {
    setSequelize,
    getStudentProfileDetails
}
