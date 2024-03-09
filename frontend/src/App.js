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
import Professor from './pages/Professor/Professor';
import StudentDashboard from './pages/studentpage/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

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
            <ProtectedRoute path='/student' component={Student} allowedRoles={['student']} />
            <ProtectedRoute path='/viewcourses/:courseId' component={Course} allowedRoles={['student']} />
            <ProtectedRoute path='/studenthome' component={Student} allowedRoles={['student']} />
              <ProtectedRoute path='/viewprofile' component={StudentDashboard} allowedRoles={['student']} />
            <ProtectedRoute path="/professor" component={Professor} allowedRoles={['professor']}/>
          </Switch>
          <Footer />
      </Router>
      </AuthProvider>
      
    
  );
}

export default App;
