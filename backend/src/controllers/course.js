// Controller file for Viewing courses

let sequelizeInstance; // Sequelize instance

// Setter function to set the Sequelize instance
function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}

// List all materials for a specific course
async function getCourseById(req, res) {
    const { courseId } = req.params;
    try {
        const course = await getCourse().findAll({ where: { course_id: courseId } });
        if (course.length === 1) {
            res.json(course[0]);
        } else {
            throw new Error("unexpected failure: found multiple courses")
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error listing materials for course', error: error.message });
    }
};


function getCourse()  {
    if (!sequelizeInstance) {
        throw new Error('Sequelize is not initialized');
    }

    const Course = require('../models/course')(sequelizeInstance)
    return Course
}

module.exports = {
    setSequelize,
    getCourseById,
};
