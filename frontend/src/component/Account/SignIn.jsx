import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";



const SignIn = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });



  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  if (toast.show) {
    const timer = setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [toast.show]);
  // Check if user already logged in on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validateForm = () => {
  const newErrors = {};
  let firstErrorMessage = '';

  if (!formData.email) {
    newErrors.email = "Email is required";
    if (!firstErrorMessage) firstErrorMessage = "Please enter your email address";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
    if (!firstErrorMessage) firstErrorMessage = "Please enter a valid email address";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
    if (!firstErrorMessage) firstErrorMessage = "Please enter your password";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    if (!firstErrorMessage) firstErrorMessage = "Password is too short (minimum 6 characters)";
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

// 4. Update handleSubmit function - replace the try-catch block
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

       if (!res.ok) {
      const errorMsg = data.message || "Username or password incorrect";
      setServerError(errorMsg);
      setToast({
        show: true,
        message: `❌ ${errorMsg}`,
        type: 'error'
      });
    } else {
      console.log("Login success:", data);
      localStorage.setItem("userId", data.userId);
      setIsLoggedIn(true);
      
      // Show success toast
      setToast({
        show: true,
        message: "🎉 Welcome back! Login successful",
        type: 'success'
      });
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  } catch (error) {
    const errorMsg = "Server error. Please try again later.";
    setServerError(errorMsg);
    setToast({
      show: true,
      message: `❌ ${errorMsg}`,
      type: 'error'
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setServerError("");
    setToast({
    show: true,
    message: "👋 You have been logged out successfully",
    type: 'success'
  });
};
  

 if (isLoggedIn) {
  return (
    <div className="signin-container">
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

      <div className="signin-card">
        <h2>You are already logged in</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}


  return (
  <div className="signin-container">
      {/* Add Toast here */}
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
      <div className="signin-card">
        <div className="signin-header">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <h1>FoodApp</h1>
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to your account to continue your culinary journey</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {serverError && <p className="error-message">{serverError}</p>}

          <div className="form-options">
            <label className="checkbox-label">
  <input
    type="checkbox"
    name="rememberMe"
    checked={formData.rememberMe}
    onChange={handleChange}
    className="checkbox-input"  // Add this class
  />
  <span className="checkmark"></span>
  Remember me
</label>
            <a href="#forgot" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-signin">
          <button className="social-btn google">
            <span className="social-icon">G</span>
            Continue with Google
          </button>
          <button className="social-btn facebook">
            <span className="social-icon">f</span>
            Continue with Facebook
          </button>
        </div>

        <div className="signin-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
