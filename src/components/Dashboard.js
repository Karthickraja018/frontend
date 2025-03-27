import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }

        // First try to fetch products, which is less likely to fail
        const productsRes = await axios.get('http://localhost:5000/api/products');
        setProducts(productsRes.data);
        
        // Then try to fetch profile data
        try {
          const profileRes = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(profileRes.data);
        } catch (profileErr) {
          console.error('Profile fetch error:', profileErr);
          // Continue even if profile fetch fails
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (err.response && err.response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load data. Please try again later.');
        }
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      
      {/* User Profile Section */}
      {profile ? (
        <div className="profile">
          <h3>Welcome, {username || profile.username}!</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
          <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
        </div>
      ) : !error && (
        <p>Loading profile...</p>
      )}

      {/* Product Listing Section */}
      <h3>Featured Products</h3>
      {products.length > 0 ? (
        <div className="products">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="product">
              <h4>{product.name}</h4>
              <p><strong>Price:</strong> ${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      ) : !error && (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default Dashboard;