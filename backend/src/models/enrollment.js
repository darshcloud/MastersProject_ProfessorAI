// models/Enrollment.js
const { DataTypes } = require('sequelize');
const Student = require('./student');
const Course = require('./course');

module.exports = (sequelize) => {
    const Enrollment = sequelize.define('Enrollment', {
        student_id: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    });

    Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
    Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

    return Enrollment;
};
