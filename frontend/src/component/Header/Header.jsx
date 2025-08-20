// src/component/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const foodImages = [
    'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [foodImages.length]);

  return (
    <header className="home-header">
      <div className="header-overlay"></div>
      
      {/* Animated Background Pattern */}
      <div className="header-bg-pattern">
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
      </div>

      <div className="header-content">
        <div className="header-text">
          <h1 className="main-title">
            Delicious <span className="title-highlight">Food Hub</span>
          </h1>
          <p className="header-subtitle">
            Discover amazing recipes and culinary adventures
          </p>
          <button className="cta-button">Start Cooking</button>
        </div>

        {/* Shaking Food Photos */}
        <div className="food-gallery-header">
          <div className="food-grid">
            {foodImages.slice(0, 4).map((image, index) => (
              <div key={index} className={`food-item shake-${index + 1}`}>
                <img src={image} alt={`Food ${index + 1}`} />
                <div className="food-item-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
