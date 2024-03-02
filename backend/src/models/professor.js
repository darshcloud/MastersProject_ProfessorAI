// models/Professor.js

const { DataTypes } = require('sequelize');
const Course = require('./Course');

module.exports = (sequelize) => {
    const Professor = sequelize.define('Professor', {
        professor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        tableName:'professors',
        timestamps: false 
    });

    Professor.hasMany(Course(sequelize), { foreignKey: 'professor_id' });

    return Professor;
};
