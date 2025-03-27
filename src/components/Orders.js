import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.image || 'https://picsum.photos/50/50?random=' + item.id} 
                        alt={item.name} 
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <Link to={`/order/${order.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;