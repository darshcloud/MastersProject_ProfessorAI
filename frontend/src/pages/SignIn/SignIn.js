import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import { useAuth } from '../../context/AuthContext'; // Adjust the path as necessary
import { InfoSection } from '../../components';
import { homeObjOne } from './Data';

function SignIn() {
  const { isAuthenticated, isProfessor, isStudent, isLoading } = useAuth(); // Destructure needed values from useAuth
  const history = useHistory(); // Initialize useHistory hook for redirection

  useEffect(() => {
    // Redirect user based on their role if already authenticated
    if (!isLoading && isAuthenticated) {
      if (isProfessor) {
        history.push('/professor/dashboard'); 
      } else if (isStudent) {
        history.push('/student/dashboard'); 
      }
      // Add more role checks and redirects as needed
    }
  }, [isAuthenticated, isProfessor, isStudent, isLoading, history]);

  const handleSignIn = () => {
    console.log("Sign in button clicked");
    window.location.href = 'http://localhost:5000/google'; // Update with your backend's auth URL
  };

  const signInObj = {
    ...homeObjOne,
    buttonClick: handleSignIn, // Add the click handler to the object
  };

  return (
    <>
      <InfoSection {...signInObj} />
    </>
  );
}

export default SignIn;
