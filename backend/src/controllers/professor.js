// professorCtrl.js

let sequelizeInstance; // Sequelize instance

// Setter function to set the Sequelize instance
function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}

// Controller function to get all professors (sample function)
async function getAllProfessors(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        // Fetch all professors from the database
        const Professor = require('../models/Professor')(sequelizeInstance); // Initialize Professor model with Sequelize instance
        const professors = await Professor.findAll();

        // Send the list of professors as a response
        res.json(professors);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

//Controller function to retrieve profile information for a specific professor

async function getProfessorProfileDetails(req, res) {
    try {
        // Check if Sequelize instance is available
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const Professor = require('../models/Professor')(sequelizeInstance);
        const Course = require('../models/Course')(sequelizeInstance);

        // Fetch the professor by professorId including associated courses
        const professorId = req.params.professor_id;
        const professor = await Professor.findByPk(professorId, {
            include: [{
                model: Course,
                attributes: ['course_code', 'course_name']
            }],
            attributes: ['first_name', 'last_name', 'email', 'bio', 'phone_number']
        });

        if (!professor) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Send the professor profile as a response
        res.json(professor);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

//Controller Function to update profile information
async function updateProfileInformation(req, res) {
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const Professor = require('../models/Professor')(sequelizeInstance);

        const { professor_id } = req.params;

        // Extract Bio and Phone Number from request body
        const { bio, phone_number } = req.body;

        // Find the professor by professorId
        const professor = await Professor.findByPk(professor_id);

        // If professor does not exist, return an error
        if (!professor) {
            return res.status(404).json({ message: 'Profile Information not found to Update' });
        }

        // Update the professor's profile information
        professor.bio = bio;
        professor.phone_number = phone_number;

        // Save the changes to the database
        await professor.save();

        // Send a success response once saved
        res.json({ message: 'Profile Details updated and saved successfully' });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
}

async function getEnrolledStudentDetails(req, res) {
    const Course = require('../models/course')(sequelizeInstance);
    const Enrollment=require('../models/enrollment')(sequelizeInstance);
    const Student=require('../models/student')(sequelizeInstance);

    try {
        const students =  await Student.findAll({
            include: [{
                model: Course,
                through: {
                    model: Enrollment,
                    where: { course_id: req.params.course_id }
                },
                required: true
            }]
        });
        console.log(students)

        const enrolledStudents =  students.map(student => ({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            phone_number: student.phone_number
        }));

        res.json({ enrolledStudents });
    } catch (error) {
        console.error('Error retrieving enrolled students:', error);
        res.status(500).json({ message: error.message});
    }
}

//Controller function for searching students by name enrolled in the course

const { Op } = require('sequelize');
async function searchStudents(req, res){
    try {
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const Course = require('../models/course')(sequelizeInstance);
        const Enrollment=require('../models/enrollment')(sequelizeInstance);
        const Student=require('../models/student')(sequelizeInstance);

        const courseId = req.params.course_id;
        const searchName  = req.query.name;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        let whereClause = {};
        if (searchName) {
            const names = searchName.split(' ').filter(Boolean);

            if (names.length > 1) {
                // Search for full name (first and last name)
                whereClause = {
                    [Op.and]: [
                        { first_name: { [Op.like]: `%${names[0]}%` } },
                        { last_name: { [Op.like]: `%${names[1]}%` } }
                    ]
                };
            } else {
                // Search for either first name or last name
                whereClause = {
                    [Op.or]: [
                        { first_name: { [Op.like]: `%${names[0]}%` } },
                        { last_name: { [Op.like]: `%${names[0]}%` } }
                    ]
                };
            }
        }

        const studentsList = await Student.findAll({
            include: [{
                model: Course,
                through: {
                    model: Enrollment,
                    where: { course_id: courseId },
                    attributes: []
                },
                attributes: [],
                required: true
            }],
            where: whereClause,
            attributes: ['first_name', 'last_name', 'email']
        });

        if (studentsList.length === 0) {
            return res.json({ message: "No students with the provided name are enrolled in this course" });
        }

        res.json(studentsList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    setSequelize,
    getAllProfessors,
    getProfessorProfileDetails,
    updateProfileInformation,
    getEnrolledStudentDetails,
    searchStudents
}








