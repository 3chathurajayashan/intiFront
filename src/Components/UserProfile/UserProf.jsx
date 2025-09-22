import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../UserProfile/Prof.css";
import { jsPDF } from "jspdf";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);  
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});
  const [editComplainId, setEditComplainId] = useState(null);
  const [editComplainData, setEditComplainData] = useState({});
  const navigate = useNavigate();

  // ===== Notification component =====
  const Notification = ({ message }) => {
    if (!message) return null;
    return (
      <div className={`profile-toast ${message.type || "success"}`}>
        {message.text}
      </div>
    );
  };

  // Fetch user, orders, and complains
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;
        const userId = storedUser._id;

        // User profile
        const userRes = await axios.get(`http://localhost:5001/users/profile/${userId}`);
        setUser(userRes.data);
        setForm(userRes.data);

        // Orders
        const ordersRes = await axios.get(`http://localhost:5001/api/orders/myorders/${userId}`);
        setOrders(ordersRes.data);

        // Complains
        const complainsRes = await axios.get(`http://localhost:5001/api/complains/user/${userId}`);
        setComplains(complainsRes.data);

      } catch (err) {
        console.error("Error fetching profile/orders/complains:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Refresh orders
  const fetchOrders = async () => {
    try {
      const ordersRes = await axios.get(`http://localhost:5001/api/orders/myorders/${user._id}`);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh complains
  const fetchComplains = async () => {
    try {
      const complainsRes = await axios.get(`http://localhost:5001/api/complains/user/${user._id}`);
      setComplains(complainsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Profile form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`http://localhost:5001/users/profile/${user._id}`, form);
      setUser(res.data);
      setEditMode(false);
      setNotification({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ text: "Error updating profile.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Edit order
  const handleEditOrder = (order) => {
    setEditOrderId(order._id);
    setEditOrderData({ ...order });
  };

  // Update order
  const handleUpdateOrder = async () => {
    try {
      const { street, city, province, postalCode } = editOrderData.shippingAddress || {};
      if (!street || !city || !province || !postalCode) {
        setNotification({ text: "Please fill all shipping fields!", type: "error" });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      await axios.put(`http://localhost:5001/api/orders/update/${editOrderId}`, {
        user: user._id,
        shippingAddress: editOrderData.shippingAddress
      });

      setEditOrderId(null);
      fetchOrders();
      setNotification({ text: "Order updated successfully!", type: "success" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Frontend update error:", err.response?.data || err.message);
      setNotification({ text: "Error updating order.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5001/api/orders/delete/${orderId}/${user._id}`);
      fetchOrders();
      setNotification({ text: "Order deleted successfully!", type: "success" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ text: "Error deleting order.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Download PDF
  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Details", 105, 15, { align: "center" });
    doc.setFontSize(12);
    let y = 30;
    doc.text(`Order ID: ${order._id}`, 15, y);
    y += 10;
    doc.text(`Total Amount: රු - ${order.totalAmount}/=`, 15, y);
    y += 10;
    doc.text(`Status: ${order.status}`, 15, y);
    y += 10;
    doc.text(`Payment: ${order.paymentMethod} - ${order.paymentStatus}`, 15, y);
    y += 10;

    const addr = order.shippingAddress || {};
    doc.text(`Shipping Address: ${addr.street || ''}, ${addr.city || ''}, ${addr.province || ''}, ${addr.postalCode || ''}`, 15, y);
    y += 10;

    doc.text("Products:", 15, y);
    y += 10;
    (order.products || []).forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.product?.name} - Qty: ${p.quantity} - Price: රු - ${p.priceAtPurchase}/=`, 20, y);
      y += 8;
    });

    doc.save(`Order_${order._id}.pdf`);
  };

  // ===== COMPLAIN HANDLERS =====
  const handleEditComplain = (complain) => {
    setEditComplainId(complain._id);
    setEditComplainData({ ...complain });
  };

  const handleUpdateComplain = async () => {
    try {
      await axios.put(`http://localhost:5001/api/complains/update/${editComplainId}`, editComplainData);
      setEditComplainId(null);
      fetchComplains();
      setNotification({ text: "Complain updated successfully!", type: "success" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ text: "Error updating complain.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteComplain = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/complains/delete/${id}`);
      fetchComplains();
      setNotification({ text: "Complain deleted successfully!", type: "success" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ text: "Error deleting complain.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
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
      {/* Notification */}
      <Notification message={notification} />

      {/* User Profile */}
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
            <Link to="/" className="back">Back to home</Link>
          </div>
        </div>
        <div className="profile-info-section">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="profile-img"/>
          ) : <div className="profile-placeholder">No Image</div>}

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
              `${user.address?.street}, ${user.address?.city}, ${user.address?.province}, ${user.address?.postalCode}`
            )}</p>
            <p><strong>License:</strong> {editMode ? <input name="pharmacyLicenseNumber" value={form.pharmacyLicenseNumber} onChange={handleChange} className="profile-input"/> : user.pharmacyLicenseNumber || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Complains */}
      <div className="complains-card">
        <h2>My Complains for Nancee.lk</h2>
        {complains.length === 0 ? (
          <div className="no-complains">No complains submitted yet.</div>
        ) : (
          <div className="complains-list">
            {complains.map((c) => (
              <div key={c._id} className="complain-item">
                {editComplainId === c._id ? (
                  <div className="edit-complain-form">
                    <input type="text" value={editComplainData.subject || ""} onChange={e => setEditComplainData(prev => ({ ...prev, subject: e.target.value }))} placeholder="Subject"/>
                    <textarea value={editComplainData.description || ""} onChange={e => setEditComplainData(prev => ({ ...prev, description: e.target.value }))} placeholder="Description"></textarea>
                    <input type="text" value={editComplainData.complainType || ""} onChange={e => setEditComplainData(prev => ({ ...prev, complainType: e.target.value }))} placeholder="Type"/>
                    <input type="text" value={editComplainData.priority || ""} onChange={e => setEditComplainData(prev => ({ ...prev, priority: e.target.value }))} placeholder="Priority"/>
                    <button onClick={handleUpdateComplain}>Save</button>
                    <button onClick={() => setEditComplainId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p><strong>Subject:</strong> {c.subject}</p>
                    <p><strong>Description:</strong> {c.description}</p>
                    <p><strong>Type:</strong> {c.complainType}</p>
                    <p><strong>Priority:</strong> {c.priority}</p>
                    <p><strong>Status:</strong> {c.status}</p>
                    <p><strong>Submitted on:</strong> {new Date(c.createdAt).toLocaleString()}</p>
                    <div className="complain-actions">
                      <button onClick={() => handleEditComplain(c)}>Edit Complain</button>
                      <button onClick={() => handleDeleteComplain(c._id)} className="dl">Remove my complain</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="orders-card">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <div className="no-orders">No orders placed yet.</div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-item">
                {editOrderId === order._id ? (
                  <div className="edit-order-form">
                    <input type="text" placeholder="Street" value={editOrderData.shippingAddress?.street || ""} onChange={e => setEditOrderData(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, street: e.target.value } }))}/>
                    <input type="text" placeholder="City" value={editOrderData.shippingAddress?.city || ""} onChange={e => setEditOrderData(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, city: e.target.value } }))}/>
                    <input type="text" placeholder="Province" value={editOrderData.shippingAddress?.province || ""} onChange={e => setEditOrderData(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, province: e.target.value } }))}/>
                    <input type="text" placeholder="Postal Code" value={editOrderData.shippingAddress?.postalCode || ""} onChange={e => setEditOrderData(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value } }))}/>
                    <button onClick={handleUpdateOrder}>Save</button>
                    <button onClick={() => setEditOrderId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Total Amount:</strong> රු - {order.totalAmount}/=</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
                    <p><strong>Shipping Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.province}, {order.shippingAddress?.postalCode}</p>
                    <div>
                      <strong>Products:</strong>
                      <ul>
                        {(order.products || []).map((p, idx) => (
                          <li key={idx}>{p.product?.name} - Qty: {p.quantity} - Price: රු - {p.priceAtPurchase}/=</li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-actions">
                      <button onClick={() => handleEditOrder(order)}>Change</button>
                      <button onClick={() => handleDeleteOrder(order._id)} className="dl">Remove</button>
                      <button onClick={() => handleDownloadPDF(order)}>Download order report</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
