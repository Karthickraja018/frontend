import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // For product details, we don't need authentication
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',  // Use the /add endpoint which is already defined
        { productId: id, quantity },  // Changed from product_id to productId to match backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/cart');
    } catch (err) {
      setError('Failed to add product to cart. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-container">
          <img 
            src={product.image || 'https://picsum.photos/500/500?random=' + product.id} 
            alt={product.name} 
            className="product-detail-image"
          />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
          </div>
          
          {isLoggedIn ? (
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
          ) : (
            <Link to="/login" className="login-to-buy-btn">
              Login to Purchase
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;