// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// Correct the import path in ProtectedRoute.js
import { useAuth } from '../context/AuthContext';

const UnauthorizedMessage = () => (
  <div style={{ textAlign: 'center', marginTop: '130px',marginBottom: '170px', color: 'red' }}> 
    <h2>Unauthorized Access</h2>
    <p>You do not have permission to view this page.</p>
  </div>
);



const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const { isAuthenticated, currentUser, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) {
            return <div>Loading...</div>; // Or any other loading indicator
          }
        if (!isAuthenticated) {
          // User not authenticated; redirect to login page
          return <Redirect to="/" />;
        } else if (allowedRoles && !allowedRoles.includes(currentUser.user_role)) {
          // User does not have the required role; redirect to an unauthorized page or homepage
          return <UnauthorizedMessage />;
        }
        // User is authenticated and has the required role
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
