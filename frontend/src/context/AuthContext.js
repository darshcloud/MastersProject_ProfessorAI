import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminAuth = () => {
    const adminToken = Cookies.get('token'); // Get token from cookies
    if (adminToken) {
      try {
        const decodedToken = jwtDecode(adminToken);
        const isAdmin = decodedToken.email === process.env.REACT_APP_ADMIN_EMAIL && decodedToken.userId === "admin";
        setIsAdminAuthenticated(isAdmin);
      } catch (error) {
        console.error('Error decoding admin token:', error);
        setIsAdminAuthenticated(false);
      }
    } else {
      setIsAdminAuthenticated(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/status', { credentials: 'include' });
      const data = await response.json();
      if (data.isAuthenticated) {
        setCurrentUser(data.user);
        console.log(data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    checkAdminAuth();

  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/logout', { credentials: 'include' }); 
      setCurrentUser(null); 
      adminLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  
  const adminLogout = () => {
    Cookies.remove('token');
    setIsAdminAuthenticated(false); 
  };

  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    isAuthenticated,
    isAdminAuthenticated, 
    isLoading,
    isProfessor: currentUser?.user_role === 'professor',
    isStudent: currentUser?.user_role === 'student',
    logout,
    adminLogout,
    checkAdminAuth, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};