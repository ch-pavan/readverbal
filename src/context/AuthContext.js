import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Load user info when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally fetch user data (e.g., profile) from the server
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('https://verbal-backend-0cao.onrender.com/api/auth/login', { email, password });
    setUser(response.data);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  };

  const register = async (name, email, password) => {
    const response = await axios.post('https://verbal-backend-0cao.onrender.com/api/auth/register', { name, email, password });
    setUser(response.data);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
