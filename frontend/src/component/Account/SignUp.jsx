import React, { useState, useEffect } from 'react';
import { Link, useLocation  } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const location = useLocation();
  const [infoMessage, setInfoMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // MOVED INSIDE COMPONENT
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({}); // MOVED ABOVE handleSubmit
  const [isLoading, setIsLoading] = useState(false); // MOVED ABOVE handleSubmit
  const [passwordStrength, setPasswordStrength] = useState(0); // MOVED ABOVE handleSubmit

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    if (location.state?.message) {
      window.scrollTo(0, 0);
      setInfoMessage(location.state.message);

      // Optionally clear message after some time
      const timer = setTimeout(() => setInfoMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return levels[strength] || "Very Weak";
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
    return colors[strength] || "#ef4444";
  };

  const validateForm = () => {
  const newErrors = {};
  let firstErrorMessage = '';

  // First Name validation
  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
    if (!firstErrorMessage) firstErrorMessage = "Please enter your first name";
  } else if (formData.firstName.trim().length < 2) {
    newErrors.firstName = "First name must be at least 2 characters";
    if (!firstErrorMessage) firstErrorMessage = "First name is too short";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
    newErrors.firstName = "First name can only contain letters";
    if (!firstErrorMessage) firstErrorMessage = "First name contains invalid characters";
  }

  // Last Name validation
  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
    if (!firstErrorMessage) firstErrorMessage = "Please enter your last name";
  } else if (formData.lastName.trim().length < 2) {
    newErrors.lastName = "Last name must be at least 2 characters";
    if (!firstErrorMessage) firstErrorMessage = "Last name is too short";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
    newErrors.lastName = "Last name can only contain letters";
    if (!firstErrorMessage) firstErrorMessage = "Last name contains invalid characters";
  }

  // Email validation
  if (!formData.email) {
    newErrors.email = "Email is required";
    if (!firstErrorMessage) firstErrorMessage = "Please enter your email address";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
    if (!firstErrorMessage) firstErrorMessage = "Please enter a valid email address";
  } else if (formData.email.length > 100) {
    newErrors.email = "Email is too long";
    if (!firstErrorMessage) firstErrorMessage = "Email address is too long";
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
    if (!firstErrorMessage) firstErrorMessage = "Please create a password";
  } else if (formData.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
    if (!firstErrorMessage) firstErrorMessage = "Password is too short (minimum 8 characters)";
  } else if (formData.password.length > 50) {
    newErrors.password = "Password is too long";
    if (!firstErrorMessage) firstErrorMessage = "Password is too long (maximum 50 characters)";
  } else if (!/(?=.*[a-z])/.test(formData.password)) {
    newErrors.password = "Password must contain at least one lowercase letter";
    if (!firstErrorMessage) firstErrorMessage = "Password needs a lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(formData.password)) {
    newErrors.password = "Password must contain at least one uppercase letter";
    if (!firstErrorMessage) firstErrorMessage = "Password needs an uppercase letter";
  } else if (!/(?=.*\d)/.test(formData.password)) {
    newErrors.password = "Password must contain at least one number";
    if (!firstErrorMessage) firstErrorMessage = "Password needs at least one number";
  } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
    newErrors.password = "Password must contain at least one special character (@$!%*?&)";
    if (!firstErrorMessage) firstErrorMessage = "Password needs a special character";
  }

  // Confirm Password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
    if (!firstErrorMessage) firstErrorMessage = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
    if (!firstErrorMessage) firstErrorMessage = "Passwords don't match";
  }

  // Terms agreement validation
  if (!formData.agreeToTerms) {
    newErrors.agreeToTerms = "You must agree to the terms and conditions";
    if (!firstErrorMessage) firstErrorMessage = "Please accept the terms and conditions";
  }

  // Show toast message for validation errors
  if (Object.keys(newErrors).length > 0 && firstErrorMessage) {
    setToast({
      show: true,
      message: `❌ ${firstErrorMessage}`,
      type: 'error'
    });
  }

  return newErrors;
};

// Updated handleSubmit function to work with enhanced validation
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const data = await response.json();
      setToast({
        show: true,
        message: data.message || "Account created successfully! Welcome to FoodApp! 🎉",
        type: 'success'
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
    } catch (error) {
      console.error("Sign up error:", error);

      setToast({
        show: true,
        message: error.message || "Something went wrong. Please try again later.",
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close" 
              onClick={() => setToast({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="signup-form-wrapper">
        {infoMessage && (
          <div className="info-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {infoMessage}
          </div>
        )}
        
        <Link to="/" className="back-link">←</Link>

        <div className="signup-header">
          <div className="logo-wrapper">
            <span className="logo-emoji">🍽️</span>
            <h1 className="app-title">FoodApp</h1>
          </div>
          <h2 className="heading">Join Our Community!</h2>
          <p className="subheading">Sign up now to order your favorite foods and enjoy delicious recipes from around the world!</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="name-fields">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={errors.password ? 'input-error' : ''}
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar-background">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength),
                    }}
                  ></div>
                </div>
                <span
                  className="strength-text"
                  style={{ color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="checkbox-group">
            <label htmlFor="agreeToTerms">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree to the <span className="link-text">Terms of Service</span> and{' '}
              <span className="link-text">Privacy Policy</span>
            </label>
            {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? (
              <>
                <div className="spinner"></div> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="divider-wrapper">
          <div className="divider-line">
            <span className="divider-text">or</span>
          </div>
        </div>

        <div className="social-buttons">
          <button className="social-btn google-btn">
            <span className="social-icon">G</span> Google
          </button>
          <button className="social-btn facebook-btn">
            <span className="social-icon facebook-icon">f</span> Facebook
          </button>
        </div>

        <div className="signin-link-wrapper">
          <p>
            Already have an account? <Link to="/signin" className="signin-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;