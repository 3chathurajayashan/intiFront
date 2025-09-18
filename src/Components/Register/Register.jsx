import React, { useState } from "react";
import "../Register/Reg.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const history = useNavigate();

  const [user, setUser] = useState({
    name: "",
    gmail: "",      // keep as gmail
    mobile: "",
    password: "",
    homeTown: "",
    role: "admin",  // default role
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then(() => {
        alert("Sign Up Success!");
        history("/"); // redirect to login or dashboard
      })
      .catch((err) => {
        alert(err.response?.data?.message || err.message);
      });
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5001/admins", {
      name: String(user.name),
      gmail: String(user.gmail),      // corrected here
      mobile: String(user.mobile),
      password: String(user.password),
      homeTown: String(user.homeTown),
      role: user.role,
    });
    return res.data;
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Sign Up Employee</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          required
          value={user.name}
          onChange={handleInputChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="gmail"
          required
          value={user.gmail}
          onChange={handleInputChange}
        />

        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          required
          value={user.mobile}
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

        <label>Home Town</label>
        <input
          type="text"
          name="homeTown"
          required
          value={user.homeTown}
          onChange={handleInputChange}
        />

        <label>Role</label>
        <select name="role" value={user.role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="inventory">Inventory Manager</option>
          <option value="sales">Sales Rep</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
