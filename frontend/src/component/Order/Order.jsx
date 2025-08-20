import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const location = useLocation();
  const item = location.state?.item;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    quantity: 1,
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toast notification system
  const showToast = (message, type = 'info') => {
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

  useEffect(() => {
    showToast('Fill out the form to place your order', 'info');
  }, []);

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9+\-\s()]{10,15}$/.test(value.replace(/\s/g, ''))) return 'Invalid phone number format';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'address':
        if (!value.trim()) return 'Delivery address is required';
        if (value.trim().length < 10) return 'Please provide a complete address (minimum 10 characters)';
        return '';
      case 'quantity':
        if (isNaN(value) || value < 1) return 'Quantity must be at least 1';
        if (value > 10) return 'Maximum quantity is 10';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'quantity' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Validate immediately if the field was previously touched/blurred
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (field !== 'specialInstructions') {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched to show errors
    setTouched({
      name: true,
      phone: true,
      email: true,
      address: true,
      quantity: true
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the validation errors before proceeding', 'error');
      return;
    }

    setIsLoading(true);
    showToast('Processing your order...', 'info');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = {
        ...formData,
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        itemImage: item.image,
        totalPrice: (parseFloat(item.price.replace('$', '')) * formData.quantity).toFixed(2),
        orderDate: new Date().toISOString()
      };
      
      showToast('Order details saved! Redirecting to payment...', 'success');
      
      navigate('/payment', { 
        state: { 
          orderData: order 
        } 
      });
      
    } catch (error) {
      showToast('Failed to process order. Please try again.', 'error');
      console.error('Order submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="order-page">
        <div className="order-container">
          <h2>No item selected</h2>
          <button 
            className="submit-btn" 
            onClick={() => navigate('/')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = (parseFloat(item.price.replace('$', '')) * formData.quantity).toFixed(2);

  return (
    <div className="order-page">
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
      
      <div className="order-container">
        <h2>Order {item.name}</h2>
        
        <div className="order-content">
          <div className="item-info">
            <img 
              src={item.image} 
              alt={item.name} 
              className="item-image" 
              loading="lazy"
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
            </div>
          </div>

          <form className="order-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+1 (555) 123-4567"
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input form-textarea ${errors.address ? 'error' : ''}`}
                placeholder="Enter your complete delivery address including apartment/unit number"
                rows="3"
                required
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input quantity-input ${errors.quantity ? 'error' : ''}`}
                required
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="specialInstructions" className="form-label">Special Instructions</label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Any allergies, dietary restrictions, or special requests..."
                rows="3"
              />
            </div>

            <div className="order-summary">
              <div className="total-price">
                <span>Total:</span>
                <span className="price-amount">{totalPrice} LKR</span>
              </div>
              <button 
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;