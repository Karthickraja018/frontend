import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!username || username.length < 3) newErrors.username = 'Username must be at least 3 characters long';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
        full_name: fullName,
        address,
        phone,
      });
      setMessage('Registration successful! Please log in.');
      setErrors({});
      setUsername('');
      setEmail('');
      setPassword('');
      setFullName('');
      setAddress('');
      setPhone('');
      onRegister();
    } catch (err) {
      setMessage('Registration failed. Username or email may already exist.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
        </div>
        <div>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        </div>
        <div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;