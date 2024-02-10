const express = require('express');
const router = express.Router();
const professorCtrl = require('../controllers/professor');

// Define routes
router.get('/professor', professorCtrl.getAllProfessors);

module.exports = (sequelize) => {
    // Pass Sequelize instance to controller
    professorCtrl.setSequelize(sequelize);

    return router;
};
