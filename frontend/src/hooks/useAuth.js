// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureStorage } from '../utils/security';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = secureStorage.get('auth_token');
      const userData = secureStorage.get('user');
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await api.login(email, password);
      
      if (response.data.token) {
        // Store token and user data securely
        secureStorage.set('auth_token', response.data.token, 7);
        secureStorage.set('user', response.data.user, 7);
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        
        navigate('/admin');
        return { success: true };
      }
      
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      secureStorage.remove('auth_token');
      secureStorage.remove('user');
      secureStorage.remove('csrf_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/');
    }
  }, [navigate]);

  // Register
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await api.register(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update user
  const updateUser = useCallback((userData) => {
    if (userData) {
      secureStorage.set('user', userData, 7);
      setUser(userData);
    }
  }, []);

  // Check if user has admin role
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: isAdmin(),
    login,
    logout,
    register,
    updateUser,
  };
};