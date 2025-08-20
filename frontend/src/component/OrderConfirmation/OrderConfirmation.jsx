import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const navigateToHome = () => {
    showToast('Redirecting to menu...', 'info');
    navigate('/');
  };

  useEffect(() => {
    if (!location.state?.orderData) {
      showToast('No order data found, redirecting to menu...', 'error');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    setOrder(location.state.orderData);
    showToast('🎉 Order confirmed! Thank you for your purchase!', 'success');
  }, [location.state, navigate, showToast]);

  if (!order) {
    return (
      <div className="confirmation-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  const totalPrice = typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice;

  return (
    <div className="confirmation-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '⚠'}
                {toast.type === 'info' && 'ℹ'}
              </span>
              <span className="toast-message">{toast.message}</span>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="confirmation-card">
        <div className="confirmation-header">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase, {order.name}!</p>
        </div>

        <div className="confirmation-details">
          <h2>Order Summary</h2>

          <div className="item-info">
            <img src={order.itemImage} alt={order.itemName} className="item-image" />
            <div className="item-details">
              <h3>{order.itemName}</h3>
              <p>Quantity: {order.quantity}</p>
              <p className="price">Price: {order.itemPrice}</p>
            </div>
          </div>

          <div className="delivery-info">
            <h3>Delivery Information</h3>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">{order.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{order.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{order.email}</span>
            </div>
            {order.specialInstructions && (
              <div className="info-item">
                <span className="info-label">Special Instructions:</span>
                <span className="info-value">{order.specialInstructions}</span>
              </div>
            )}
          </div>

          <div className="total-section">
            <h3>Total Amount Paid</h3>
            <span>{totalPrice}</span>
          </div>
        </div>

        <div className="confirmation-footer">
          <div className="confirmation-info">
            <p>📧 An email confirmation has been sent to {order.email}</p>
            <p>🚚 Estimated delivery time: 30-45 minutes</p>
          </div>
          <button className="back-to-menu" onClick={navigateToHome}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
