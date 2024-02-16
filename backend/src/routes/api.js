const express = require('express');
const router = express.Router();
const professorCtrl = require('../controllers/professor');
const adminCtrl= require('../controllers/admin');

// Define routes
router.get('/professor', professorCtrl.getAllProfessors);
router.get('/professor/profile/:professor_id', professorCtrl.getProfessorProfileDetails);
router.put('/professor/profile/update/:professor_id', professorCtrl.updateProfileInformation);
router.get('/professor/students/list/:course_id', professorCtrl.getEnrolledStudentDetails);
router.post('/admin/register', adminCtrl.registerUser);
router.post('/admin/student/enroll', adminCtrl.enrollStudent);
router.put('/admin/student/:student_id', adminCtrl.updateStudent);
router.delete('/admin/student/:student_id', adminCtrl.deleteStudent);
router.delete('/admin/professor/:professor_id', adminCtrl.deleteProfessor);

module.exports = (sequelize) => {
    // Pass Sequelize instance to controller
    adminCtrl.setSequelize(sequelize);
    professorCtrl.setSequelize(sequelize);

    return router;
};
