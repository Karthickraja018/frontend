import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-detail-container">
      <h2>Order Details</h2>
      
      <div className="order-info">
        <div className="order-header">
          <h3>Order #{order.id}</h3>
          <span className={`status-badge ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        
        <div className="order-meta">
          <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
          <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
          <p><strong>Payment Method:</strong> {order.payment_method}</p>
        </div>
      </div>
      
      <div className="order-items-container">
        <h3>Items</h3>
        <div className="order-items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img 
                  src={item.image || 'https://picsum.photos/100/100?random=' + item.id} 
                  alt={item.name} 
                />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>${order.shipping_cost.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="order-actions">
        <Link to="/orders" className="back-btn">Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetail;