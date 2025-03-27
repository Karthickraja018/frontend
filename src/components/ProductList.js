import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img 
                src={product.image || 'https://picsum.photos/300/300?random=' + product.id} 
                alt={product.name} 
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="description">{product.description}</p>
                <div className="product-actions">
                  <Link to={`/product/${product.id}`} className="view-details">View Details</Link>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;