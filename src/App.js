import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleRegister = () => {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <h1>E-Commerce Auth</h1>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route
                path="/"
                element={<Login onLogin={handleLogin} />}
              />
              <Route
                path="/register"
                element={<Register onRegister={handleRegister} />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </>
          ) : (
            <Route path="/" element={<Dashboard username={username} />} />
          )}
        </Routes>
        {!isLoggedIn && (
          <nav>
            <Link to="/">Login</Link> | <Link to="/register">Register</Link>
          </nav>
        )}
      </div>
    </Router>
  );
}

export default App;