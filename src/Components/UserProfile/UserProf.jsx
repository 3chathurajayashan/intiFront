import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserProfile/Prof.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false); // saving state
  const [notification, setNotification] = useState(""); // toast message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const userId = storedUser._id;

        const userRes = await axios.get(`http://localhost:5001/users/profile/${userId}`);
        setUser(userRes.data);
        setForm(userRes.data);

        const ordersRes = await axios.get(`http://localhost:5001/api/orders/myorders/${userId}`);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Error fetching profile/orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`http://localhost:5001/users/profile/${user._id}`, form);
      setUser(res.data);
      setEditMode(false);
      setNotification("Profile updated successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error(err);
      setNotification("Error updating profile.");
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="profile-loader-container">
      <div className="profile-loader"></div>
      <p>Loading profile...</p>
    </div>
  );

  if (!user) return <p className="profile-text-center">No user data found.</p>;

  return (
    <div className="profile-main-container fade-in">

      {/* Toast notification */}
      {notification && <div className="profile-toast">{notification}</div>}

      {/* User Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <div className="profile-buttons">
            {editMode ? (
              <button className="profile-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            ) : (
              <button className="profile-btn-edit" onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
            <button className="profile-btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="profile-info-section">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="profile-img"/>
          ) : (
            <div className="profile-placeholder">No Image</div>
          )}

          <div className="profile-details">
            <p><strong>Pharmacy Name:</strong> {editMode ? <input name="pharmacyName" value={form.pharmacyName} onChange={handleChange} className="profile-input"/> : user.pharmacyName || "N/A"}</p>
            <p><strong>Owner Name:</strong> {editMode ? <input name="ownerName" value={form.ownerName} onChange={handleChange} className="profile-input"/> : user.ownerName || "N/A"}</p>
            <p><strong>Email:</strong> {editMode ? <input name="email" value={form.email} onChange={handleChange} className="profile-input"/> : user.email || "N/A"}</p>
            <p><strong>Phone:</strong> {editMode ? <input name="phone" value={form.phone} onChange={handleChange} className="profile-input"/> : user.phone || "N/A"}</p>
            <p><strong>Address:</strong> {editMode ? (
              <>
                <input name="address.street" value={form.address?.street || ""} onChange={handleChange} className="profile-input mb-1" placeholder="Street"/>
                <input name="address.city" value={form.address?.city || ""} onChange={handleChange} className="profile-input mb-1" placeholder="City"/>
                <input name="address.province" value={form.address?.province || ""} onChange={handleChange} className="profile-input mb-1" placeholder="Province"/>
                <input name="address.postalCode" value={form.address?.postalCode || ""} onChange={handleChange} className="profile-input" placeholder="Postal Code"/>
              </>
            ) : (
              `${user.address?.street || ""}, ${user.address?.city || ""}, ${user.address?.province || ""}, ${user.address?.postalCode || ""}`
            )}</p>
            <p><strong>License:</strong> {editMode ? <input name="pharmacyLicenseNumber" value={form.pharmacyLicenseNumber} onChange={handleChange} className="profile-input"/> : user.pharmacyLicenseNumber || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Orders Card */}
      <div className="orders-card">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <div className="no-orders">No orders placed yet.</div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-item">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount || 0}</p>
                <p><strong>Status:</strong> {order.status || "N/A"}</p>
                <p><strong>Payment:</strong> {order.paymentMethod || "N/A"} - {order.paymentStatus || "N/A"}</p>
                <p><strong>Shipping Address:</strong> {order.shippingAddress?.street || ""}, {order.shippingAddress?.city || ""}, {order.shippingAddress?.province || ""}, {order.shippingAddress?.postalCode || ""}</p>
                <div>
                  <strong>Products:</strong>
                  <ul>
                    {(order.products || []).map((p, idx) => (
                      <li key={p.product?._id || idx}>{p.product?.name || "Unknown Product"} - Qty: {p.quantity || 0} - Price: ${p.priceAtPurchase || 0}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
