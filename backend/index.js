const express = require('express');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

// MySQL connection configuration
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Load routes
const apiRoutes = require('./src/routes/api');

// Use routes
app.use('/api', apiRoutes(sequelize));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
