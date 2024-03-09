const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const professorCtrl = require('../controllers/professor');
const adminCtrl= require('../controllers/admin');
const courseMaterialCtrl = require('../controllers/course_material');
const studentCtrl = require('../controllers/student');
const upload = multer();
const { isLoggedIn } = require('../config/authMiddleware');

// Define routes
router.get('/professor',adminCtrl.requireAdmin, professorCtrl.getAllProfessors);
router.get('/professor/profile/:professor_id',isLoggedIn, professorCtrl.getProfessorProfileDetails);
router.put('/professor/profile/update/:professor_id',isLoggedIn, professorCtrl.updateProfileInformation);
router.get('/professor/students/list/:course_id',isLoggedIn, professorCtrl.getEnrolledStudentDetails);
router.get('/professor/students/search/:course_id',isLoggedIn, professorCtrl.searchStudents);
router.post('/admin/register',adminCtrl.requireAdmin, adminCtrl.registerUser);
router.post('/admin/courses', adminCtrl.addNewCourse)
router.put('/admin/course/:course_id/assignProfessor',adminCtrl.assignProfessor)
router.post('/admin/student/enroll',adminCtrl.requireAdmin, adminCtrl.enrollStudent);
router.put('/admin/student/:student_id',adminCtrl.requireAdmin, adminCtrl.updateStudent);
router.put('/admin/professor/:professor_id',adminCtrl.requireAdmin, adminCtrl.updateProfessor);
router.delete('/admin/student/:student_id',adminCtrl.requireAdmin, adminCtrl.deleteStudent);
router.delete('/admin/professor/:professor_id',adminCtrl.requireAdmin, adminCtrl.deleteProfessor);
router.get('/courses/:courseId/materials',isLoggedIn, courseMaterialCtrl.listAllMaterialsForCourse);
router.post('/courses/:courseId/materials', isLoggedIn,upload.single('file'), courseMaterialCtrl.addMaterialForCourse);
router.put('/courses/:courseId/materials/:id',isLoggedIn, upload.single('file'), courseMaterialCtrl.updateMaterialForCourse);
router.delete('/courses/:courseId/materials/:id', isLoggedIn,courseMaterialCtrl.deleteMaterialForCourse);
router.get('/courses/:courseId/materials/:materialId/view/',isLoggedIn, courseMaterialCtrl.viewMaterialForCourse);
router.get('/student/profile/:student_id',isLoggedIn, studentCtrl.getStudentProfileDetails);
router.put('/student/profile/update/:student_id',isLoggedIn, studentCtrl.updateStudentProfileInformation);
router.get('/student/:student_id/courses',isLoggedIn, studentCtrl.getEnrolledCoursesDetails);
router.post('/admin/login', adminCtrl.adminLogin);

module.exports = (sequelize) => {
    // Pass Sequelize instance to controller
    adminCtrl.setSequelize(sequelize);
    professorCtrl.setSequelize(sequelize);
    courseMaterialCtrl.setSequelize(sequelize);
    studentCtrl.setSequelize(sequelize);
    return router;
};

