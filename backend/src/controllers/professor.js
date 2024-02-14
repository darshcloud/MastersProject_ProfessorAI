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

        // association among tables to retrieve only one course as
        //one course is associated with each professor
        Professor.hasOne(Course, { foreignKey: 'professor_id' });
        Course.belongsTo(Professor, { foreignKey: 'professor_id' });

        // Fetch the professor by professorId including associated courses
        const professorId = req.params.professor_id;
        const professor = await Professor.findByPk(professorId, {
            include: [{
                model: Course,
                attributes: ['course_code', 'course_name']
            }],
            attributes: ['first_name', 'last_name', 'email']
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

module.exports = {
    setSequelize,
    getAllProfessors,
    getProfessorProfileDetails
};
