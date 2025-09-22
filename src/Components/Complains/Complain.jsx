import { useState, useEffect } from "react";
import axios from "axios";
import '../Complains/Comp.css'
export default function ComplainForm({ user: propUser, onSuccess }) {
  const [user, setUser] = useState(propUser || null);

  const [form, setForm] = useState({
    username: "",
    subject: "",
    description: "",
    complainType: "Other",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Load user from localStorage if not passed as prop
  useEffect(() => {
    if (!propUser) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }
  }, [propUser]);

  // Set username in form when user is available
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, username: user.ownerName || "" }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.description) {
      setNotification({ show: true, message: "Please fill all required fields!", type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      return;
    }

    if (!user?._id) {
      setNotification({ show: true, message: "User ID is missing. Please login again.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      console.log("Submitting complain:", { ...form, user: user._id });

      const res = await axios.post("http://localhost:5001/api/complains/create", {
        ...form,
        user: user._id,
      });

      console.log("Backend response:", res.data);

      setNotification({ show: true, message: "Complain submitted successfully!", type: "success" });

      // Reset form except username
      setForm(prev => ({
        ...prev,
        subject: "",
        description: "",
        complainType: "Other",
        priority: "Medium",
      }));

      onSuccess?.(); // refresh parent component if needed
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      const message = err.response?.data?.error || err.response?.data?.message || "Failed to submit complain.";
      setNotification({ show: true, message, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
    }
  };

  return (
    <div className="profile-card">
      {notification.show && (
        <div className={`profile-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h2>Send Complains to Nancee</h2>

      <form className="complain-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="profile-input"
            readOnly
          />
        </label>

        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="profile-input"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="profile-input"
            rows={5}
          />
        </label>

        <label>
          Complain Type:
          <select
            name="complainType"
            value={form.complainType}
            onChange={handleChange}
            className="profile-input"
          >
            <option value="Technical">Technical</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Priority:
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="profile-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <button type="submit" className="profile-btn-save" disabled={loading}>
          {loading ? "Submitting..." : "Send my complain"}
        </button>
      </form>
    </div>
  );
}
