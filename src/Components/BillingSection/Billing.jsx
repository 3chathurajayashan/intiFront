import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Billing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, userId } = location.state;

  const [shipping, setShipping] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleInput = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        user: userId,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
        totalAmount,
        shippingAddress: shipping,
      };

      await axios.post("/api/orders", orderData);

      // Optionally, clear cart after placing order
      await axios.delete(`/api/cart/clear/${userId}`);

      alert("Order placed successfully!");
      navigate("/orders"); // redirect to user orders page
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="billing-page">
      <h2>Billing</h2>
      <div>
        {cart.map((item) => (
          <div key={item.product._id}>
            <span>{item.product.name}</span> - Qty: {item.quantity} - $
            {item.product.price}
          </div>
        ))}
      </div>
      <h3>Total: ${totalAmount}</h3>

      <h3>Shipping Details</h3>
      <input
        name="street"
        placeholder="Street"
        onChange={handleInput}
      />
      <input
        name="city"
        placeholder="City"
        onChange={handleInput}
      />
      <input
        name="province"
        placeholder="Province"
        onChange={handleInput}
      />
      <input
        name="postalCode"
        placeholder="Postal Code"
        onChange={handleInput}
      />

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
