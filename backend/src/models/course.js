// models/Course.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Course = sequelize.define('Course', {
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
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
            allowNull: true,
            references: {
                model: 'professors',
                key: 'professor_id'
            }
        },
    },{
        timestamps: false // Disable timestamps if you're handling them manually
    });

    const Enrollment = require("./enrollment")(sequelize);
    Course.hasMany(Enrollment, {
        foreignKey: 'course_id',
        onDelete: 'CASCADE', // optional, if you want cascading deletes
    });

    return Course;
};