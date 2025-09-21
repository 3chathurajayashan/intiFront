import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserLogin/UserLo.css"; // Custom CSS file

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`http://localhost:5001/users/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setNotification({
        show: true,
        message: "Login successful! Redirecting...",
        type: "success"
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      let errorMessage = "Login failed";
      if (err.response) {
        errorMessage = err.response.data.message || "Login failed";
      } else if (err.request) {
        errorMessage = "No response from server. Check backend is running.";
      } else {
        errorMessage = "Error: " + err.message;
      }

      setNotification({
        show: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`notification ${notification.show ? 'show' : ''} ${notification.type}`}>
        <div className="notification-content">
          <div className="icon">
            {notification.type === 'success' ? (
              <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="notification-message">{notification.message}</p>
        </div>
      </div>

      <div className="login-card">
        <div className="login-card-body">
          <div className="login-header">
            <div className="login-icon">
              <svg className="lock-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="button-group">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="signup-text">
            <p>
              Don't have an account? <a href="#">Get started</a>
            </p>
          </div>
        </div>

        <div className="login-footer">
          <div className="social-buttons">
            <button className="social-btn google">
              <svg className="svg-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 ..." />
              </svg>
            </button>
            <button className="social-btn twitter">
              <svg className="svg-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-..." />
              </svg>
            </button>
            <button className="social-btn github">
              <svg className="svg-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627..." />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
