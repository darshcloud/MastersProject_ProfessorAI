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

module.exports = {
    setSequelize,
    getAllProfessors
};
