import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login/Log.css";

function Login() {
  const history = useNavigate();

  const [user, setUser] = useState({
    gmail: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest();
      if (response.status === "ok") {
        // Save user info
        localStorage.setItem("currentUser", JSON.stringify(response.user));
        history("/profile");  
      } else {
        alert(response.message || "Invalid credentials!");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5001/login", {
      gmail: String(user.gmail),
      password: String(user.password),
    });
    return res.data;
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Sign In Admin</h2>

        <label>User Mail</label>
        <input
          type='email'
          name='gmail'
          required
          value={user.gmail}
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          type='password'
          name='password'
          required
          value={user.password}
          onChange={handleInputChange}
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
