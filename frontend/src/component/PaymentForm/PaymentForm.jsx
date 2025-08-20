import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './PaymentForm.css';
import { useLocation } from 'react-router-dom';

const PaymentForm = () => {
  const location = useLocation();
   const order = location.state?.orderData || {
    itemName: 'Default Item',
    quantity: 1,
    totalPrice: 0,
    itemImage: ''
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  

  
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'error') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (expiry) => {
    if (!expiry) return false;
    const [year, month] = expiry.split('-');
    const expiryDate = new Date(year, month - 1);
    const today = new Date();
    today.setDate(1);
    return expiryDate >= today;
  };

  const validateCVV = (cvv) => {
    return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
  };

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (letters only, at least 2 characters)';
    }
    
    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number (13-19 digits)';
    }
    
    if (!validateExpiry(formData.expiry)) {
      newErrors.expiry = 'Please enter a valid future expiry date';
    }
    
    if (!validateCVV(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
      }
    }
    
    if (name === 'cvv' && value.length > 4) {
      return;
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    showToast('Please fix the validation errors before proceeding', 'error');
    return;
  }

  setIsLoading(true);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to confirmation with all order data
    navigate('/order-confirmation', { 
      state: { 
        orderData: {
          ...location.state?.orderData, // This contains the food details from Order page
          paymentDetails: formData,     // Payment details
          paymentDate: new Date().toISOString()
        }
      } 
    });
    
  } catch (error) {
    showToast('Payment failed. Please try again.', 'error');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="payment-container">
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
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-form">
        <h2 className="payment-title">Payment Details</h2>
        <div className="order-summary">
  <h3>Order Summary</h3>
  <div className="order-item">
    <img src={order.itemImage} alt={order.itemName} className="order-item-image" />
    <div className="order-item-details">
      <p>{order.itemName}</p>
      <p>Quantity: {order.quantity}</p>
    </div>
  </div>
  <p className="total-price">Total: {order.totalPrice} LKR</p>
</div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name on Card</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`form-input card-number ${errors.cardNumber ? 'error' : ''}`}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="month"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className={`form-input ${errors.expiry ? 'error' : ''}`}
                required
              />
              {errors.expiry && <span className="error-message">{errors.expiry}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className={`form-input cvv-input ${errors.cvv ? 'error' : ''}`}
                placeholder="123"
                maxLength="4"
                required
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

        <div className="security-icons">
          <div className="security-icon">🔒 SSL</div>
          <div className="security-icon">💳 VISA</div>
          <div className="security-icon">💳 MC</div>
          <div className="security-icon">💳 AMEX</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;