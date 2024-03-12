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
import AdminSignIn from './pages/AdminSignIn/LoginPage';
import AdminPage from './pages/AdminSignIn/AdminPage';
import AddCoursePage from './pages/AdminSignIn/AddCoursePage';
import Register from './pages/AdminSignIn/Register';

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
            <Route path='/admin/login' component={AdminSignIn} />
            <Route path='/add-course' component={AddCoursePage} />
            <Route path='/register' component={Register} />
            <Route path='/admin/dashboard' component={AdminPage} allowedRoles={['admin']} />
            <ProtectedRoute path='/student' component={Student} allowedRoles={['student']} />
            <ProtectedRoute path='/viewcourses/:courseId' component={Course} allowedRoles={['student']} />
            <ProtectedRoute path='/studenthome' component={Student} allowedRoles={['student']} />
            <ProtectedRoute path='/viewprofile' component={StudentProfile} allowedRoles={['student']} />
              <ProtectedRoute path="/professorHome" component={Professor} allowedRoles={['professor']}/>
            <ProtectedRoute path="/Professor/Course/:courseId/upload" component={MaterialUpload} allowedRoles={['professor']}/>
            <ProtectedRoute path="/Professor/Course/:courseId" component={CourseDetails} allowedRoles={['professor']} />
            <ProtectedRoute path="/Professor" component={Professor} allowedRoles={['professor']}/>
          </Switch>
          <Footer />
      </Router>
      </AuthProvider>
      
    
  );
}

export default App;
