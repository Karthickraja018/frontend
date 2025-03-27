import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const [cartResponse, profileResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setCartItems(cartResponse.data);
        calculateTotal(cartResponse.data);
        
        // Pre-fill form with user profile data if available
        const profile = profileResponse.data;
        if (profile) {
          setFormData(prevState => ({
            ...prevState,
            fullName: profile.full_name || '',
            address: profile.address || ''
          }));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load checkout information. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

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
      const response = await axios.post(
        'http://localhost:5000/api/orders/create',
        {
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          paymentMethod: 'Credit Card',
          paymentDetails: {
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCvv: formData.cardCvv
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrderPlaced(true);
      setOrderId(response.data.orderId);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading checkout...</div>;
  if (error) return <div className="error">{error}</div>;

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order ID is: <strong>{orderId}</strong></p>
        <p>You will receive a confirmation email shortly.</p>
        <button onClick={() => navigate('/')} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items-summary">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="checkout-form">
          <h3>Shipping & Payment Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <h4>Payment Information</h4>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiry Date</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardCvv">CVV</label>
                <input
                  type="text"
                  id="cardCvv"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;