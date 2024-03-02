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
import StudentDashboard from './pages/studentpage/StudentDashboard';

function App() {
  return (
    
      <Router>
          <GlobalStyles />
          <ScrollToTop />
          <Navbar />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/About' component={About} />
            <Route path='/SignIn' component={SignIn} />
            <Route path='/student' component={Student} />
            <Route path='/viewcourses' component={Course} />
            <Route path='/dashboard' component={StudentDashboard} />
          </Switch>
          <Footer />
      </Router>
        
    
  );
}

export default App;
