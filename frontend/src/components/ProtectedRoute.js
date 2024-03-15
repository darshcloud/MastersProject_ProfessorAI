import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure the correct path is used

const UnauthorizedMessage = () => (
  <div style={{ textAlign: 'center', marginTop: '130px', marginBottom: '170px', color: 'red' }}>
    <h2>Unauthorized Access</h2>
    <p>You do not have permission to view this page.</p>
  </div>
);

const ProtectedRoute = ({ component: Component, allowedRoles, isAdminRoute, ...rest }) => {
    const { isAuthenticated, isAdminAuthenticated, currentUser, isLoading } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                if (isLoading) {
                    return <div>Loading...</div>; // Placeholder for loading state
                } else if (isAdminRoute) {
                    // This route is specifically for admin users
                    if (!isAdminAuthenticated) {
                        // Not authenticated as admin; redirect to login page
                        return <Redirect to="/" />;
                    } else {
                        // User is authenticated as admin
                        return <Component {...props} />;
                    }
                } else {
                    // This route is for general users
                    if (!isAuthenticated) {
                        // User not authenticated; redirect to login page
                        return <Redirect to="/" />;
                    } else if (allowedRoles && !allowedRoles.includes(currentUser?.user_role)) {
                        // User does not have the required role; show unauthorized message
                        return <UnauthorizedMessage />;
                    }
                    // User is authenticated and has the required role
                    return <Component {...props} />;
                }
            }}
        />
    );
};

export default ProtectedRoute;
