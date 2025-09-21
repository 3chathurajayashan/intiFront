import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ProductSection/Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(4);
  const [activeSlides, setActiveSlides] = useState({});
  const [autoPlayIntervals, setAutoPlayIntervals] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
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
    if (width < 900) return 3;
    return 4;
  };
  useEffect(() => {
    const handleResize = () => setDisplayCount(getDisplayCount());
    setDisplayCount(getDisplayCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Initialize active slides and auto-play ---
  useEffect(() => {
    const initialSlides = {};
    const intervals = {};
    products.forEach((p) => {
      if (p.images && p.images.length > 1) {
        initialSlides[p._id] = 0;
        intervals[p._id] = setInterval(() => {
          setActiveSlides((prev) => {
            const currentSlide = prev[p._id] || 0;
            const nextSlide = (currentSlide + 1) % p.images.length;
            return { ...prev, [p._id]: nextSlide };
          });
        }, 4000);
      }
    });
    setActiveSlides(initialSlides);
    setAutoPlayIntervals(intervals);
    return () => Object.values(intervals).forEach((i) => clearInterval(i));
  }, [products]);

  // --- Product labels ---
  const getProductLabels = (product) => {
    const labels = [];
    if (product.stock === 0) labels.push({ type: "out-of-stock", text: "Out of Stock", position: "left" });
    else if (product.stock < 10) labels.push({ type: "low-stock", text: "Low Stock", position: "left" });
    else labels.push({ type: "in-stock", text: "In Stock", position: "left" });

    if (product.priceLKR < 1000) labels.push({ type: "best-value", text: "Best Value", position: "right" });
    else if (product.priceLKR > 5000) labels.push({ type: "premium", text: "Premium", position: "right" });

    if (product.priceLKR && product.oldPrice && product.oldPrice > product.priceLKR) {
      const discount = Math.round(((product.oldPrice - product.priceLKR) / product.oldPrice) * 100);
      labels.push({ type: "discount", text: `${discount}% OFF`, position: "right" });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const productDate = new Date(product.createdAt || product.dateAdded || Date.now());
    if (productDate > oneWeekAgo) labels.push({ type: "new", text: "New", position: "right" });

    return labels;
  };

  // --- Prev/Next for product slider ---
  const totalPages = Math.ceil(products.length / displayCount);
  const handlePrevSet = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextSet = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  const handleAddToCart = async (id, e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to add products to cart", { position: "top-right" });
      navigate("/logins");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5001/cart/${userId}/add`, {
        productId: id,
        quantity: 1,
      });
      toast.success(res.data.message || "Product added to cart!", { position: "top-right" });
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add product to cart", { position: "top-right" });
    }
  };

  return (
    <div className="featured-products-wow">
      <ToastContainer autoClose={2000} />
      <div className="wow-heading-wrapper">
        <h2 className="wow-heading">
          <span className="wow-text-blue">Today's Best</span>{" "}
          <span className="wow-text-teal">deals for you</span>
        </h2>
      </div>

      <div className="product-slider-container">
        <button className="product-slider-btn prev" onClick={handlePrevSet} disabled={currentPage === 0}>‹</button>
        <div className="product-slider-wrapper">
          <div className="product-slider-track" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
            {products.map((p) => (
              <div key={p._id} className="card wow-card premium-card fixed-card">
                {getProductLabels(p).map((label, index) => (
                  <div key={index} className={`product-label ${label.type} label-${label.position}`}>{label.text}</div>
                ))}
                <div className="image-container" onClick={() => navigate(`/product/${p._id}`)}>
                  {p.images && p.images.length > 0 ? (
                    p.images.length > 1 ? (
                      <div className="slider-container">
                        <div className="slides-wrapper" style={{ transform: `translateX(-${(activeSlides[p._id] || 0) * 100}%)` }}>
                          {p.images.map((img, i) => (
                            <div key={i} className="slide">
                              <img src={typeof img === "string" ? img : img.url} alt={`${p.name}`} className="product-image premium-image" />
                            </div>
                          ))}
                        </div>
                        <div className="slider-indicators">
                          {p.images.map((_, i) => (
                            <button
                              key={i}
                              className={`indicator ${i === (activeSlides[p._id] || 0) ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlides(prev => ({ ...prev, [p._id]: i }));
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <img src={typeof p.images[0] === "string" ? p.images[0] : p.images[0].url} alt={p.name} className="single-image product-image premium-image" />
                    )
                  ) : <div className="no-image">No Image</div>}
                </div>

                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-description">{p.description}</p>
                  <div className="product-details">
                    <span className="brand">Brand: {p.brand}</span>
                    <span className="category">Category: {p.category}</span>
                  </div>
                  <div className="pricing-stock">
                    <div className="prices">
                      <span className="price">LKR {p.priceLKR.toLocaleString()}</span>
                      {p.oldPrice && p.oldPrice > p.priceLKR && <span className="oldPrice">LKR {p.oldPrice.toLocaleString()}</span>}
                    </div>
                    <span className={p.stock > 0 ? "instock" : "outstock"}>{p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}</span>
                  </div>
                  <button className="add-to-cart-btn premium-btn" onClick={(e) => handleAddToCart(p._id, e)} disabled={p.stock === 0}>
                    {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="product-slider-btn next" onClick={handleNextSet} disabled={currentPage >= totalPages - 1}>›</button>
      </div>
    </div>
  );
}