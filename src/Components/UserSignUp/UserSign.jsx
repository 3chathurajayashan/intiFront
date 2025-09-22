// src/components/SignupForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserSignUp/UserSign.css"; // import CSS

export default function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pharmacyName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
    pharmacyLicenseNumber: "",
    profileImage: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5001/users", formData);
      setSuccess("Signup successful! Redirecting...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Pharmacy Account</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <input
          type="text"
          name="pharmacyName"
          placeholder="Pharmacy Name"
          value={formData.pharmacyName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address.street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address.province"
          placeholder="Province"
          value={formData.address.province}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address.postalCode"
          placeholder="Postal Code"
          value={formData.address.postalCode}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pharmacyLicenseNumber"
          placeholder="Pharmacy License Number"
          value={formData.pharmacyLicenseNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="profileImage"
          placeholder="Profile Image URL (optional)"
          value={formData.profileImage}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
