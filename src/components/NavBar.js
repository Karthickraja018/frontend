import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavBar = ({ isLoggedIn, onLogout }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/api/cart/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(response.data.count);
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
      if (err.response && err.response.status === 403) {
        // Token is invalid, clear it and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        onLogout();
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ShopEasy</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/products" className="navbar-item">Products</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="navbar-item">Dashboard</Link>
            <Link to="/orders" className="navbar-item">Orders</Link>
            <Link to="/profile" className="navbar-item">Profile</Link>
            <Link to="/cart" className="navbar-item cart-icon">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button onClick={handleLogout} className="navbar-item logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;