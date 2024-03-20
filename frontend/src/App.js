import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom' 
import GlobalStyles from './globalStyles'
import { Navbar, Footer } from './components';
import Home from './pages/HomePage/Home';
import About from './pages/About/About';
import SignIn from './pages/SignIn/SignIn';
import ScrollToTop from './components/ScrollToTop';
import Student from './pages/studentpage/Student';
import Course from './pages/studentpage/Course';
import StudentProfile from './pages/studentpage/StudentProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Professor from "./pages/ProfessorPage/Professor";
import CourseDetails from "./pages/ProfessorPage/CourseDetails";
import MaterialUpload from "./pages/ProfessorPage/MaterialUpload";
import AdminLogin from './pages/Admin/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddCoursePage from './pages/Admin/AddCoursePage';
import Register from './pages/Admin/Register';
import RemoveUser from './pages/Admin/RemovestudentsProfessors';
import RemoveCourse from './pages/Admin/RemoveCourse';
import ProfessorProfile from "./pages/ProfessorPage/ProfessorProfile";
import GetEnrolledStudents from './pages/ProfessorPage/GetEnrolledStudents';
function App() {
  return (
    <AuthProvider>
      <Router>
          <GlobalStyles />
          <ScrollToTop />
          <Navbar />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/About' component={About} />
            <Route path='/SignIn' component={SignIn} />
            <Route path='/admin/addcourse' component={AddCoursePage} isAdminRoute={true} />
            <ProtectedRoute path='/admin/register' component={Register} isAdminRoute={true} />
            <ProtectedRoute path="/admin/removeuser" component={RemoveUser} isAdminRoute={true} />
            <Route path='/admin/login' component={AdminLogin} />
            <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} isAdminRoute={true} />
            <ProtectedRoute path="/admin/removecourse" component={RemoveCourse} isAdminRoute={true} />
            <ProtectedRoute path='/student' component={Student} allowedRoles={['student']} />
            <ProtectedRoute path='/viewcourses/:courseId' component={Course} allowedRoles={['student']} />
            <ProtectedRoute path='/studenthome' component={Student} allowedRoles={['student']} />
            <ProtectedRoute path='/viewprofile' component={StudentProfile} allowedRoles={['student']} />
            <ProtectedRoute path="/professorHome" component={Professor} allowedRoles={['professor']}/>
            <ProtectedRoute path="/Professor/Course/:courseId/upload" component={MaterialUpload} allowedRoles={['professor']}/>
            <ProtectedRoute path="/Professor/Course/:courseId" component={CourseDetails} allowedRoles={['professor']} />
            <ProtectedRoute path="/Professor" component={Professor} allowedRoles={['professor']}/>
            <ProtectedRoute path='/profileview' component={ProfessorProfile} allowedRoles={['professor']} />
            <ProtectedRoute path='/getenrolledstudents' component={GetEnrolledStudents} allowedRoles={['professor']} />
          </Switch>
          <Footer />
      </Router>
      </AuthProvider>
      
    
  );
}

export default App;
