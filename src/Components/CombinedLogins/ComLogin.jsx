import { useState, useEffect } from "react";
import { useNavigate , Link} from "react-router-dom";
import axios from "axios";
import "../CombinedLogins/Com.css";

export default function CombinedLogin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: "", 
    type: "" 
  });

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Reset form when switching tabs
  useEffect(() => {
    setEmail("");
    setPassword("");
    setNotification({ show: false, message: "", type: "" });
  }, [activeTab]);

  // Handle user login
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/users/login", {
        email: email.trim(),
        password: password.trim(),
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showNotification("Welcome back! Redirecting to store...", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      let errorMessage = err.response?.data?.message || "Login failed";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/login", {
        gmail: email.trim(),
        password: password.trim(),
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      showNotification("Admin access granted! Redirecting...", "success");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Admin login failed";
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = activeTab === "user" ? handleUserLogin : handleAdminLogin;

  return (
    <div className="login-container">
      {/* Notification */}
      <div className={`notification ${notification.type} ${notification.show ? "show" : ""}`}>
        <span>{notification.message}</span>
      </div>

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Nancee</h1>
          <p className="login-subtitle">Your premium Medicine destination</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`tab-btn ${activeTab === "user" ? "active" : ""}`}
            onClick={() => setActiveTab("user")}
          >
            Customer Login
          </button>
          <button
            className={`tab-btn ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Portal
          </button>
        </div>

        {/* Form */}
        <div className="login-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === "user" ? "Enter your email" : "Admin email"}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeTab === "user" ? "Enter your password" : "Admin password"}
                required
              />
              
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Signing in..." : `Sign In ${activeTab === "admin" ? "as Admin" : ""}`}
            </button>
          </form>

          <div className="signup-link">
            {activeTab === "user" ? (
              <>Back to homepage?  <Link to="/">Go back</Link>  </>
            ) : (
              <small>Secure admin access only</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
