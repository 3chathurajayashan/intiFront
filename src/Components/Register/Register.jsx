import React, { useState } from 'react';
import "../Register/Reg.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const history = useNavigate();

  const [user, setUser] = useState({
    name: "",
    gmail: "",
    mobile: "",
    password: "",
    homeTown: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then(() => {
        alert("SignIn Success!");
        history("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5001/Admins", {
      name: String(user.name),
      gmail: String(user.gmail),
      mobile: Number(user.mobile),
      password: String(user.password),
      homeTown: String(user.homeTown),
    });
    return res.data;
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Sign Up Admin</h2>

        <label>Name</label>
        <input type='text' name='name' required value={user.name} onChange={handleInputChange} />

        <label>Gmail</label>
        <input type='email' name='gmail' required value={user.gmail} onChange={handleInputChange} />

        <label>Mobile</label>
        <input type='text' name='mobile' required value={user.mobile} onChange={handleInputChange} />

        <label>Password</label>
        <input type='password' name='password' required value={user.password} onChange={handleInputChange} />

        <label>Home Town</label>
        <input type='text' name='homeTown' required value={user.homeTown} onChange={handleInputChange} />

        <button type="submit">Sign </button>
      </form>
    </div>
  );
}

export default Register;
