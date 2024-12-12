import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError('');
      const response = await axios.get(
        'http://localhost:5000/api/essays/recommendations',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      const recommendedEssay = response.data[0];
      navigate(recommendedEssay ? `/essays/${recommendedEssay._id}` : '/essays');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <i className="icon-email"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <i className="icon-password"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
