import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ username }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage(res.data.message);
      } catch (err) {
        setMessage('Failed to load dashboard.');
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;