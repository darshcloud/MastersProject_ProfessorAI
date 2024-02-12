// models/Course.js
const { DataTypes } = require('sequelize');
const Professor = require('./Professor');

module.exports = (sequelize) => {
    const Course = sequelize.define('Course', {
        course_code: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        course_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        professor_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'professors',
                key: 'professor_id'
            }
        },
    },{
        timestamps: false // Disable timestamps if you're handling them manually
    });

    Course.belongsTo(Professor, { foreignKey: 'professor_id' });

    return Course;
};
