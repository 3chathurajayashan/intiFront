import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../BillingSection/Bill.css";

// Enhanced toast component with better styling and accessibility
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Form field component for consistency
const FormField = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => (
  <div className="form-field">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="form-input"
    />
  </div>
);

// Progress indicator component
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        {steps.map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`progress-step ${currentStep >= stepNumber ? "active" : ""}`}>
              <span className="step-number">{stepNumber}</span>
            </div>
            {stepNumber < totalSteps && (
              <div className={`progress-line ${currentStep > stepNumber ? "completed" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default function Billing() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from location state or localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = location.state?.userId || storedUser?._id;
  const cart = location.state?.cart || [];
  const totalAmount = location.state?.totalAmount || 0;

  // State management
  const [userDetails, setUserDetails] = useState(null);
  const [shipping, setShipping] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        showToast("User session not found. Please login again.", "error");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/users/${userId}`);
        const userData = response.data.user;
        
        setUserDetails(userData);
        
        // Pre-populate shipping address if available
        if (userData.address) {
          setShipping(userData.address);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        showToast("Unable to load user information. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Toast management
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: "", type: "" });
  }, []);

  // Form handlers
  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShipping(prevShipping => ({
      ...prevShipping,
      [name]: value
    }));
  };

  // Validation functions
  const validateShippingAddress = () => {
    const requiredFields = ['street', 'city', 'province', 'postalCode'];
    const missingFields = requiredFields.filter(field => !shipping[field]?.trim());
    
    if (missingFields.length > 0) {
      showToast("Please complete all required shipping address fields.", "error");
      return false;
    }
    return true;
  };

  // Order placement logic
  const handleOrderPlacement = async () => {
    if (!validateShippingAddress()) return;
    
    if (!userId) {
      showToast("User session expired. Please login again.", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty. Please add items before placing an order.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        user: userId,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: Number(item.quantity),
          priceAtPurchase: Number(item.product.priceLKR || item.product.price || 0),
        })),
        totalAmount: Number(totalAmount),
        paymentMethod: "cash",
        shippingAddress: {
          street: shipping.street.trim(),
          city: shipping.city.trim(),
          province: shipping.province.trim(),
          postalCode: shipping.postalCode.trim(),
        },
      };

      // Place the order
      await axios.post("http://localhost:5001/api/orders", orderPayload);
      
      // Clear the cart after successful order
      await axios.delete(`http://localhost:5001/cart/clear/${userId}`);

      showToast("Your order has been placed successfully!", "success");
      
      // Navigate to orders page after a brief delay
      setTimeout(() => {
        navigate(`/`, { 
          state: { orderPlaced: true } 
        });
      }, 2000);

    } catch (error) {
      console.error("Order placement failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to place your order. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (step === 2 && !validateShippingAddress()) return;
    setStep(prevStep => Math.min(prevStep + 1, 3));
  };

  const handlePreviousStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="billing-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast}
      />

      <div className="billing-header">
        <h1>Complete Your Order</h1>
        <p>Review your details and confirm your purchase</p>
      </div>

      <ProgressIndicator currentStep={step} totalSteps={3} />

      {/* Step 1: Customer Information */}
      {step === 1 && userDetails && (
        <div className="billing-section">
          <div className="section-header">
            <h2>Customer Information</h2>
            <p>Please verify your contact details</p>
          </div>
          
          <div className="customer-details">
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{userDetails.ownerName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pharmacy Name:</span>
              <span className="detail-value">{userDetails.pharmacyName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email Address:</span>
              <span className="detail-value">{userDetails.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{userDetails.phone}</span>
            </div>
          </div>

          <div className="step-navigation">
            <button 
              onClick={handleNextStep}
              className="btn btn-primary"
            >
              Continue to Shipping
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Shipping Address */}
      {step === 2 && (
        <div className="billing-section">
          <div className="section-header">
            <h2>Shipping Address</h2>
            <p>Enter your delivery address details</p>
          </div>

          <div className="shipping-form">
            <div className="form-row">
              <FormField
                label="Street Address"
                name="street"
                value={shipping.street}
                onChange={handleShippingChange}
                placeholder="Enter your street address"
                required
              />
            </div>
            
            <div className="form-row">
              <FormField
                label="City"
                name="city"
                value={shipping.city}
                onChange={handleShippingChange}
                placeholder="Enter your city"
                required
              />
              <FormField
                label="Province"
                name="province"
                value={shipping.province}
                onChange={handleShippingChange}
                placeholder="Enter your province"
                required
              />
            </div>
            
            <div className="form-row">
              <FormField
                label="Postal Code"
                name="postalCode"
                value={shipping.postalCode}
                onChange={handleShippingChange}
                placeholder="Enter postal code"
                required
              />
            </div>
          </div>

          <div className="step-navigation">
            <button 
              onClick={handlePreviousStep}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button 
              onClick={handleNextStep}
              className="btn btn-primary"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Order Summary */}
      {step === 3 && (
        <div className="billing-section">
          <div className="section-header">
            <h2>Order Summary</h2>
            <p>Review your items and confirm your purchase</p>
          </div>

          <div className="order-summary">
            <div className="order-items">
              <h3>Items Ordered</h3>
              {cart.length === 0 ? (
                <p className="empty-cart">No items in your cart</p>
              ) : (
                cart.map((item, index) => (
                  <div key={item.product._id || index} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-quantity">Quantity: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      LKR {(item.product.priceLKR || item.product.price || 0).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span className="total-label">Total Amount:</span>
                <span className="total-amount">LKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>
              <p>Cash on Delivery</p>
            </div>
          </div>

          <div className="step-navigation">
            <button 
              onClick={handlePreviousStep}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Back to Shipping
            </button>
            <button 
              onClick={handleOrderPlacement}
              className="btn btn-primary"
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}