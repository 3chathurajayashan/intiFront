import React, { useState } from "react";
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
        const loggedUser = response.user;

        // Save user info to localStorage
        localStorage.setItem("currentUser", JSON.stringify(loggedUser));

        // Redirect based on role
        switch (loggedUser.role) {
          case "admin":
            history("/profile");
            break;
          case "inventory":
            history("/profile");
            break;
          case "sales":
            history("/profile");
            break;
          default:
            history("/"); // fallback
        }
      } else {
        alert(response.message || "Invalid credentials!");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
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
        <h2 className="form-title">Sign In Employee</h2>

        <label>Email</label>
        <input
          type="email"
          name="gmail"
          required
          value={user.gmail}
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
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
