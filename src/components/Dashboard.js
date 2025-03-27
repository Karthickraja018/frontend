import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profileRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/products', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProfile(profileRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      
      {/* User Profile Section */}
      {profile ? (
        <div className="profile">
          <h3>Welcome, {username}!</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
          <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Product Listing Section */}
      <h3>Products</h3>
      {products.length > 0 ? (
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="product">
              <h4>{product.name}</h4>
              <p><strong>Price:</strong> ${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default Dashboard;