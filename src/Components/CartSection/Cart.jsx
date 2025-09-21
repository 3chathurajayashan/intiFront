import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CartSection/Carts.css";
import img1 from '../../Assests/cod.jpg'
import img2 from '../../Assests/visa.jpg'
import { FaLock, FaTruck, FaUndoAlt } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?._id || null;
  };
  const userId = getUserId();

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/cart/${userId}`);
      setCart(res.data.cart || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When user clicks "+" or "-" we now send updated quantity directly
const handleQuantityChange = async (productId, delta) => {
  const updatedCart = cart.map((item) => {
    if (item.product._id === productId) {
      const newQty = item.quantity + delta;
      return { ...item, quantity: newQty > 0 ? newQty : 1 };
    }
    return item;
  });

  setCart(updatedCart);

  const updatedItem = updatedCart.find((i) => i.product._id === productId);

  try {
    // ✅ Send the exact quantity, backend will set it
    await axios.post(`http://localhost:5001/cart/${userId}/add`, {
      productId,
      quantity: updatedItem.quantity,
    });
  } catch (err) {
    console.error(err);
  }
};

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5001/cart/${userId}/remove`, {
        data: { productId },
      });
      setCart(cart.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1);
    } else if (promoCode.toLowerCase() === "welcome15") {
      setDiscount(0.15);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product?.priceLKR || 0) * item.quantity,
    0
  );
  
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 5000 ? 0 : 300;
  const totalAmount = subtotal - discountAmount + shipping;

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="premium-cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <div className="cart-breadcrumb">
          <span>Home</span> <span className="separator">›</span>
          <span>Cart</span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="items-header">
              <h2>Items ({cart.length})</h2>
            </div>
            
            {cart.map((item) => (
              <div key={item.product._id} className="premium-cart-item">
                <div className="item-image">
                  <img
                    src={item.product.images[0]?.url || "/no-image.png"}
                    alt={item.product.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-brand">{item.product.brand}</p>
                  
                  <div className="stock-status">
                    <span className={`stock-badge ${item.product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {item.product.stock > 0 ? '✓ In Stock' : '⚠ Out of Stock'}
                    </span>
                    {item.product.stock > 0 && (
                      <span className="stock-count">({item.product.stock} available)</span>
                    )}
                  </div>
                </div>

                <div className="item-controls">
                  <div className="price-section">
                    <span className="price">LKR {item.product.priceLKR?.toLocaleString()}</span>
                  </div>
                  
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => handleQuantityChange(item.product._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => handleQuantityChange(item.product._id, 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    LKR {(item.product.priceLKR * item.quantity)?.toLocaleString()}
                  </div>
                  
                  <button 
                    className="remove-item-btn" 
                    onClick={() => removeFromCart(item.product._id)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="promo-section">
              <h3>Promo Code</h3>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button onClick={applyPromoCode} className="apply-btn">
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <div className="promo-success">
                  ✓ Promo code applied! {(discount * 100)}% off
                </div>
              )}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-line">
                <span>Subtotal ({cart.length} items)</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-line discount-line">
                  <span>Discount ({(discount * 100)}%)</span>
                  <span>-LKR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="summary-line">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <>
                      <span className="free-shipping">FREE</span>
                      <small> (Orders over LKR 5,000)</small>
                    </>
                  ) : (
                    `LKR ${shipping}`
                  )}
                </span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>LKR {totalAmount.toLocaleString()}</span>
              </div>

              <div className="checkout-actions">
                <button 
                  className="primary-checkout-btn"
                  onClick={() => navigate("/billing", { state: { cart, totalAmount , userId} })}
                >
                  Proceed to Checkout
                </button>
                
                <div className="payment-methods">
                  <span>We accept:</span>
                  <div className="payment-icons">
                     <img src={img1}></img>
                      <img src={img2}></img>
                  </div>
                </div>
                
                <button 
                  className="continue-shopping"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

           <div className="security-badges">
  <div className="security-item">
    <FaLock className="security-icon" />
    <span>Secure Checkout</span>
  </div>
  <div className="security-item">
    <FaTruck className="security-icon" />
    <span>Free Shipping over LKR 5,000</span>
  </div>
  <div className="security-item">
    <FaUndoAlt className="security-icon" />
    <span>Easy Returns</span>
  </div>
</div>
          </div>
        </div>
      )}
    </div>
  );
}