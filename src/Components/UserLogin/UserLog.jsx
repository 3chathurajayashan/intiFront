import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ Use template literal to avoid hidden newlines
      const res = await axios.post(`http://localhost:5001/users/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      // ✅ Store userId in localStorage
     localStorage.setItem("user", JSON.stringify(res.data.user)); 

      alert("Login successful!");
      navigate("/");  
    } catch (err) {
      console.error("Login error:", err);

      // Display proper error message
      if (err.response) {
        // Backend returned error
        alert(err.response.data.message || "Login failed");
      } else if (err.request) {
        // No response received
        alert("No response from server. Check backend is running.");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
