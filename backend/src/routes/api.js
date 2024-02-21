const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const professorCtrl = require('../controllers/professor');
const adminCtrl= require('../controllers/admin');
const courseMaterialCtrl = require('../controllers/course_material');
const studentCtrl = require('../controllers/student');
const upload = multer();

// Define routes
router.get('/professor', professorCtrl.getAllProfessors);
router.get('/professor/profile/:professor_id', professorCtrl.getProfessorProfileDetails);
router.put('/professor/profile/update/:professor_id', professorCtrl.updateProfileInformation);
router.get('/professor/students/list/:course_id', professorCtrl.getEnrolledStudentDetails);
router.get('/professor/students/search/:course_id', professorCtrl.searchStudents);
router.post('/admin/register',adminCtrl.requireAdmin, adminCtrl.registerUser);
router.post('/admin/courses', adminCtrl.addNewCourse)
router.put('/admin/course/:course_id/assignProfessor',adminCtrl.assignProfessor)
router.post('/admin/student/enroll',adminCtrl.requireAdmin, adminCtrl.enrollStudent);
router.put('/admin/student/:student_id',adminCtrl.requireAdmin, adminCtrl.updateStudent);
router.put('/admin/professor/:professor_id',adminCtrl.requireAdmin, adminCtrl.updateProfessor);
router.delete('/admin/student/:student_id',adminCtrl.requireAdmin, adminCtrl.deleteStudent);
router.delete('/admin/professor/:professor_id',adminCtrl.requireAdmin, adminCtrl.deleteProfessor);
router.get('/courses/:courseId/materials', courseMaterialCtrl.listAllMaterialsForCourse);
router.post('/courses/:courseId/materials', upload.single('file'), courseMaterialCtrl.addMaterialForCourse);
router.put('/courses/:courseId/materials/:id', upload.single('file'), courseMaterialCtrl.updateMaterialForCourse);
router.delete('/courses/:courseId/materials/:id', courseMaterialCtrl.deleteMaterialForCourse);
router.get('/courses/:courseId/materials/:materialId/view/', courseMaterialCtrl.viewMaterialForCourse);
router.get('/student/profile/:student_id', studentCtrl.getStudentProfileDetails);
router.put('/student/profile/update/:student_id', studentCtrl.updateStudentProfileInformation);
router.get('/student/:student_id/courses', studentCtrl.getEnrolledCoursesDetails);
router.post('/admin/login', adminCtrl.adminLogin);

module.exports = (sequelize) => {
    // Pass Sequelize instance to controller
    adminCtrl.setSequelize(sequelize);
    professorCtrl.setSequelize(sequelize);
    courseMaterialCtrl.setSequelize(sequelize);
    studentCtrl.setSequelize(sequelize);
    return router;
};

