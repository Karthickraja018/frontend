import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
        calculateTotal(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart. Please try again later.');
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

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error(err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="continue-shopping">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || 'https://picsum.photos/100/100?random=' + item.id} 
                    alt={item.name} 
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;