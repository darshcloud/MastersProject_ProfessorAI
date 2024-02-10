// models/Professor.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Professor = sequelize.define('Professor', {
        professor_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
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
        }
    }, {
        timestamps: false // Disable timestamps
    });

    return Professor;
};
