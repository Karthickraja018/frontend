import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/login', 
        { email, password },
        { 
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Also store the userId for reference
        localStorage.setItem('userId', response.data.userId);
        setMessage('Login successful!');
        setErrors({});
        setEmail('');
        setPassword('');
        onLogin(response.data.username);
      } else {
        setMessage('Login failed: Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setMessage(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
      <Link to="/forgot-password">Forgot Password?</Link>
    </div>
  );
};

export default Login;