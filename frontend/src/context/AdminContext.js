import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Admin Context
const AdminContext = createContext();

// Admin Provider Component
export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
        setIsAdminLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  // Admin Login Function
  const loginAdmin = (email, password) => {
    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@kasi.com';
    const ADMIN_PASSWORD = '1234567';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = {
        email: email,
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      setAdminUser(admin);
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      return { success: true, message: 'Admin login successful' };
    } else {
      return { success: false, message: 'Invalid admin credentials' };
    }
  };

  // Admin Logout Function
  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminUser');
  };

  // Check if user is admin
  const isAdmin = () => {
    return isAdminLoggedIn && adminUser?.role === 'admin';
  };

  const value = {
    adminUser,
    isAdminLoggedIn,
    loading,
    loginAdmin,
    logoutAdmin,
    isAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use Admin Context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
