// models/Admin.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        admin_id: {
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
        }
    });

    return Admin;
};
