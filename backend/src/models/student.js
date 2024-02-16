// models/Student.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.STRING(10),
            primaryKey: true
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

    }, {
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
