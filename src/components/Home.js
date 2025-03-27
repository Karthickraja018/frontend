import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        // Get first 4 products as featured (you could add a 'featured' field in your database)
        setFeaturedProducts(response.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to ShopEasy</h1>
        <p>Your one-stop shop for all your needs</p>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>

      <div className="featured-section">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading featured products...</p>
        ) : (
          <div className="featured-products">
            {featuredProducts.map(product => (
              <div key={product.id} className="featured-product">
                <img 
                  src={product.image || `https://picsum.photos/300/300?random=${product.id}`} 
                  alt={product.name} 
                />
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <Link to={`/product/${product.id}`} className="view-product-btn">
                  View Product
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories">
          <div className="category">
            <Link to="/products?category=electronics">
              <div className="category-image">
                <img src="https://picsum.photos/200/200?random=1" alt="Electronics" />
              </div>
              <h3>Electronics</h3>
            </Link>
          </div>
          <div className="category">
            <Link to="/products?category=clothing">
              <div className="category-image">
                <img src="https://picsum.photos/200/200?random=2" alt="Clothing" />
              </div>
              <h3>Clothing</h3>
            </Link>
          </div>
          <div className="category">
            <Link to="/products?category=home">
              <div className="category-image">
                <img src="https://picsum.photos/200/200?random=3" alt="Home & Kitchen" />
              </div>
              <h3>Home & Kitchen</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;