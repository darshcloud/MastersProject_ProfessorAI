let sequelizeInstance; 

function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}
async function registerUser(req, res) {
    try {
       
        if (!sequelizeInstance) {
            return res.status(500).json({ message: "Sequelize instance is not set." });
        }

        const { professor_id, student_id, first_name, last_name, email, role } = req.body;

        if (role !== 'professor' && role !== 'student') {
            return res.status(400).json({ message: "Invalid role. Role should be either 'professor' or 'student'." });
        }
        if (!first_name || !last_name || !email || !first_name.trim() || !last_name.trim() || !email.trim()) {
            return res.status(400).json({ message: "All fields (first name, last name, email) are required and cannot be blank." });
        }
        let Model, primaryKey;
        if (role === 'professor') {
            Model = require('../models/Professor')(sequelizeInstance);
            primaryKey = professor_id;
        } else {
            Model = require('../models/Student')(sequelizeInstance);
            primaryKey = student_id;
        }
        const newUser = await Model.create({
            professor_id: primaryKey, // Include professor_id or student_id when creating the user
            student_id: primaryKey, 
            first_name,
            last_name,
            email,
        });

        res.json({ message: "User Registration Successful!", user: newUser });
    } catch (error) {
    
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    setSequelize,
    registerUser
};
