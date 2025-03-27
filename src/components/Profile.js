import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData({
          fullName: response.data.full_name || '',
          address: response.data.address || '',
          phone: response.data.phone || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/profile/update',
        {
          full_name: formData.fullName,
          address: formData.address,
          phone: formData.phone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile({
        ...profile,
        full_name: formData.fullName,
        address: formData.address,
        phone: formData.phone
      });
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      
      {message && <div className="success-message">{message}</div>}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Username:</span>
            <span className="info-value">{profile.username}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{profile.email}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Full Name:</span>
            <span className="info-value">{profile.full_name || 'Not set'}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Address:</span>
            <span className="info-value">{profile.address || 'Not set'}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value">{profile.phone || 'Not set'}</span>
          </div>
          
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
      
      <div className="profile-links">
        <Link to="/orders" className="profile-link">View Your Orders</Link>
      </div>
    </div>
  );
};

export default Profile;