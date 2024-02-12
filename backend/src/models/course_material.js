// models/CourseMaterial.js
const { DataTypes } = require('sequelize');
const Course = require('./course');

module.exports = (sequelize) => {
    const CourseMaterial = sequelize.define('CourseMaterial', {
        material_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        URI: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        file_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses', // Name of the referenced table
                key: 'course_id' // Name of the referenced column
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW // Use DATE for timestamp with date and time
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW
        }
    }, {
        tableName: 'course_materials',
        timestamps: false
    });

    return CourseMaterial;
};
