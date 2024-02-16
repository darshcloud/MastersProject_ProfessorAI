// models/Enrollment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Enrollment = sequelize.define('Enrollment', {
        enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'students',
                key: 'student_id'
            }
        },
        course_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: 'courses',
                key: 'course_id'
            },
        }
    },  {
        timestamps: false,

    });

    return Enrollment;
};
