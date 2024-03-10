import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/status`, { credentials: 'include' });
      const data = await response.json();
      if (data.isAuthenticated) {
        setCurrentUser(data.user);
        console.log(data)
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.log(error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${backendUrl}/logout`, { credentials: 'include' }); // Adjust the endpoint as needed
      setCurrentUser(null); 
     
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    isProfessor: currentUser?.user_role === 'professor',
    isStudent: currentUser?.user_role === 'student',
    logout, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
