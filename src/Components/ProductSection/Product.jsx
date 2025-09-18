import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // styles
import "../ProductSection/Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(4);
  const navigate = useNavigate();

  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?._id || null;
  };
  const userId = getUserId();

  // --- Load products ---
  useEffect(() => {
    axios
      .get("http://localhost:5001/products")
      .then((res) => setProducts(res.data.products || res.data))
      .catch((err) => console.error(err));
  }, []);

  // --- Responsive display count ---
  const getDisplayCount = () => {
    const width = window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };
  useEffect(() => {
    const handleResize = () => setDisplayCount(getDisplayCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Add to Cart ---
  const handleAddToCart = async (productId) => {
    if (!userId) {
      toast.error("Please login to add products to cart", { position: "top-right" });
      navigate("/logins");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5001/cart/${userId}/add`, { productId, quantity: 1 });
      toast.success(res.data.message || "Product added to cart!", { position: "top-right" });
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add product to cart", { position: "top-right" });
    }
  };

  return (
    <div className="featured-products-wow">
      {/* Toast Notifications */}
      <ToastContainer autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

      {/* Heading */}
      <div className="wow-heading-wrapper">
        <h2 className="wow-heading">
          <span className="wow-text-blue">NEW</span> <span className="wow-text-teal">ARRIVALS</span>
        </h2>
        <div className="wow-paragraphs">
          <p className="wow-para fade-up" style={{ animationDelay: "0.2s" }}>Explore the latest products hand-picked for quality and style.</p>
          <p className="wow-para fade-up" style={{ animationDelay: "0.5s" }}>Stay ahead with trending items and exclusive offers just for you.</p>
          <p className="wow-para fade-up" style={{ animationDelay: "0.8s" }}>Discover premium products in one glance.</p>
        </div>
      </div>

      {/* Products Display */}
      <div className="main">
        {products.slice(0, displayCount).map((p) => (
          <div key={p._id} className="card wow-card premium-card" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${p._id}`)}>
            {/* Image Slider */}
            {p.images && p.images.length > 0 ? (
              p.images.length > 1 ? (
                <div className="slider">
                  <div className="slides" style={{ width: `${p.images.length * 100}%` }}>
                    {p.images.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === "string" ? img : img.url}
                        alt={p.name}
                        style={{ width: `${100 / p.images.length}%` }}
                        className="product-image premium-image"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <img
                  src={typeof p.images[0] === "string" ? p.images[0] : p.images[0].url}
                  alt={p.name}
                  className="single-image product-image premium-image"
                />
              )
            ) : (
              <div className="no-image">No Image Available</div>
            )}

            <h3 className="product-name">{p.name}</h3>
            <p className="product-description">{p.description}</p>

            <div className="details">
              <span>Brand: {p.brand}</span>
              <span>Category: {p.category}</span>
            </div>

            <div className="pricing-stock">
              <div className="prices">
                <span className="price">LKR {p.priceLKR}</span>
                <span className="oldPrice">LKR {p.priceLKR + 300}</span>
              </div>
              <span className={p.stock > 0 ? "instock" : "outstock"}>
                {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              className="add-to-cart-btn premium-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(p._id);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="view-all-wrapper">
        <a href="/all-products" className="view-all-wow">View All Products</a>
      </div>
    </div>
  );
}
