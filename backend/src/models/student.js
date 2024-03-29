// models/Student.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING(255), 
            allowNull: true 
        },
        phone_number: {
            type: DataTypes.STRING(20), 
            allowNull: true 
        },
        user_role: { 
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName:'students',
        timestamps: false // Disable timestamps
    });

    const Course = require("./course")(sequelize);
    const Enrollment = require("./enrollment")(sequelize);
    Student.belongsToMany(Course, {
        through: Enrollment,
        foreignKey: 'student_id',
        otherKey: 'course_id',
    });

    return Student;
};
