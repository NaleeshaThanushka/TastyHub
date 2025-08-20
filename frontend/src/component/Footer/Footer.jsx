// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#1F2937',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/5787/5787016.png" 
              alt="Food Hub Logo" 
              style={{ width: '30px', height: '30px' }}
            />
            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white'
            }}>Tasty Hub</span>
          </Link>
        </div>
        <p style={{
          color: '#9CA3AF',
          margin: 0
        }}>
          © 2024 Tasty Hub. All rights reserved. Made with ❤️ for food lovers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;