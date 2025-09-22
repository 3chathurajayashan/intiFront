import React, { useEffect, useState } from "react";
import "../AdProfile/ADprof.css";
import { FaEnvelope, FaPhone, FaHome, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    // Simulate network delay
    setTimeout(() => {
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    }, 1500);
  }, []);

  if (loading)
    return (
      <div className="loading-wrapper">
        <svg className="spinner" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
        </svg>
        <p>Loading Profile...</p>
      </div>
    );

  if (!user) return <p>No user data found.</p>;

  // Convert role string to readable format
  const getRoleName = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "inventory":
        return "Inventory Manager";
      case "sales":
        return "Sales Representative";
      default:
        return "Employee";
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>
        <h2 className="profile-name">Name : {user.name}</h2>
        <h4 className="profile-role">Title : {getRoleName(user.role)}</h4>
      </div>

      <div className="profile-cards">
        <div className="profile-card">
          <h3>Contact Info</h3>
          <p>
            <FaEnvelope className="icon" /> {user.gmail}
          </p>
          <p>
            <FaPhone className="icon" /> {user.mobile}
          </p>
          <p>
            <FaHome className="icon" /> {user.homeTown}
          </p>
        </div>

        <div className="profile-card">
          <h3>Actions</h3>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear(); // clear everything
              navigate("/");  
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
