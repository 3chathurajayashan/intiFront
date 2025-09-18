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

  // --- Initialize active slides and auto-play ---
  useEffect(() => {
    const initialSlides = {};
    const intervals = {};
    
    products.forEach((p) => {
      if (p.images && p.images.length > 1) {
        initialSlides[p._id] = 0;
        // Set up auto-play for each product with multiple images
        intervals[p._id] = setInterval(() => {
          setActiveSlides(prev => {
            const currentSlide = prev[p._id] || 0;
            const nextSlide = (currentSlide + 1) % p.images.length;
            return {
              ...prev,
              [p._id]: nextSlide
            };
          });
        }, 4000); // Change slide every 4 seconds
      }
    });
    
    setActiveSlides(initialSlides);
    setAutoPlayIntervals(intervals);
    
    // Clean up intervals on component unmount
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [products]);

  // --- Change slide manually ---
  const changeSlide = (productId, direction, e) => {
    if (e) e.stopPropagation();
    const product = products.find(p => p._id === productId);
    if (!product || !product.images) return;
    
    // Pause auto-play briefly when manually changing slides
    if (autoPlayIntervals[productId]) {
      clearInterval(autoPlayIntervals[productId]);
      
      // Restart auto-play after a delay
      setTimeout(() => {
        const newInterval = setInterval(() => {
          setActiveSlides(prev => {
            const currentSlide = prev[productId] || 0;
            const nextSlide = (currentSlide + 1) % product.images.length;
            return {
              ...prev,
              [productId]: nextSlide
            };
          });
        }, 4000);
        
        setAutoPlayIntervals(prev => ({
          ...prev,
          [productId]: newInterval
        }));
      }, 6000);
    }
    
    setActiveSlides(prev => {
      const currentSlide = prev[productId] || 0;
      let newSlide;
      
      if (direction === 'next') {
        newSlide = (currentSlide + 1) % product.images.length;
      } else {
        newSlide = (currentSlide - 1 + product.images.length) % product.images.length;
      }
      
      return {
        ...prev,
        [productId]: newSlide
      };
    });
  };

  // --- Pause auto-play on hover ---
  const pauseAutoPlay = (productId) => {
    if (autoPlayIntervals[productId]) {
      clearInterval(autoPlayIntervals[productId]);
      setAutoPlayIntervals(prev => ({
        ...prev,
        [productId]: null
      }));
    }
  };

  // --- Resume auto-play when not hovering ---
  const resumeAutoPlay = (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product || !product.images || product.images.length <= 1) return;
    
    if (!autoPlayIntervals[productId]) {
      const newInterval = setInterval(() => {
        setActiveSlides(prev => {
          const currentSlide = prev[productId] || 0;
          const nextSlide = (currentSlide + 1) % product.images.length;
          return {
            ...prev,
            [productId]: nextSlide
          };
        });
      }, 4000);
      
      setAutoPlayIntervals(prev => ({
        ...prev,
        [productId]: newInterval
      }));
    }
  };

  // --- Add to Cart ---
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
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
          <div key={p._id} className="card wow-card premium-card">
            {/* Image Container with Slider */}
            <div 
              className="image-container" 
              onClick={() => navigate(`/product/${p._id}`)}
              onMouseEnter={() => pauseAutoPlay(p._id)}
              onMouseLeave={() => resumeAutoPlay(p._id)}
            >
              {p.images && p.images.length > 0 ? (
                p.images.length > 1 ? (
                  <div className="slider-container">
                    <div 
                      className="slides-wrapper"
                      style={{ transform: `translateX(-${(activeSlides[p._id] || 0) * 100}%)` }}
                    >
                      {p.images.map((img, index) => (
                        <div key={index} className="slide">
                          <img
                            src={typeof img === "string" ? img : img.url}
                            alt={`${p.name} - View ${index + 1}`}
                            className="product-image premium-image"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Slider Controls */}
                    <button 
                      className="slider-nav prev"
                      onClick={(e) => changeSlide(p._id, 'prev', e)}
                    >
                      ‹
                    </button>
                    <button 
                      className="slider-nav next"
                      onClick={(e) => changeSlide(p._id, 'next', e)}
                    >
                      ›
                    </button>
                    
                    {/* Slider Indicators */}
                    <div className="slider-indicators">
                      {p.images.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${(activeSlides[p._id] || 0) === index ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlides(prev => ({ ...prev, [p._id]: index }));
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Auto-play indicator */}
                    <div className="auto-play-indicator">
                      <div className="auto-play-progress">
                        <div 
                          className="auto-play-progress-bar" 
                          style={{ 
                            animation: `autoPlayProgress 4s linear ${autoPlayIntervals[p._id] ? 'infinite' : 'paused'}` 
                          }}
                        ></div>
                      </div>
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
              
              {/* Quick View Button */}
              <button 
                className="quick-view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${p._id}`);
                }}
              >
                Quick View
              </button>
            </div>

            {/* Product Info */}
            <div className="product-info">
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
                onClick={(e) => handleAddToCart(p._id, e)}
              >
                Add to Cart
              </button>
            </div>
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