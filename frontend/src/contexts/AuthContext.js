import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Update the header text
const HEADER_TEXT = "Sri Vinayaga Earth Movers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post('http://localhost:5000/api/reset-password', { token, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      <header>
        <h1>{HEADER_TEXT}</h1>
      </header>
      {!loading && children}
    </AuthContext.Provider>
  );
};