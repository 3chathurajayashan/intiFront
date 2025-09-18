import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../DetailsProducts/Details.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch main product
  useEffect(() => {
    axios
      .get(`http://localhost:5001/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch related products (same category)
  useEffect(() => {
    if (product) {
      axios
        .get("http://localhost:5001/products")
        .then((res) => {
          const related = res.data.products.filter(
            (p) => p.category === product.category && p._id !== product._id
          );
          setRelatedProducts(related);
        })
        .catch((err) => console.error(err));
    }
  }, [product]);

  if (!product) return <div className="loading">Loading product...</div>;

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  const handleQuantity = (type) => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    else if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="medical-product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="medical-product-card">
        {/* Image Section */}
        <div className="image-section">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={
                  typeof product.images[currentImage] === "string"
                    ? product.images[currentImage]
                    : product.images[currentImage].url
                }
                alt={product.name}
                className="product-main-image"
              />
              {product.images.length > 1 && (
                <>
                  <button className="prev-btn" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="next-btn" onClick={nextImage}>
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">
            Category: <span>{product.category}</span>
          </p>
          <p className="product-brand">
            Brand: <span>{product.brand}</span>
          </p>
          <p className="product-price">LKR {product.priceLKR}</p>
          {product.stock > 0 ? (
            <span className="instock">In Stock ({product.stock})</span>
          ) : (
            <span className="outstock">Out of Stock</span>
          )}

          {/* Medical-specific details */}
          <div className="medical-details">
            <p>
              <strong>Dosage / Usage:</strong>{" "}
              {product.dosage || "Refer packaging / doctor guidance"}
            </p>
            <p>
              <strong>Ingredients:</strong>{" "}
              {product.ingredients || "Check packaging for details"}
            </p>
            <p>
              <strong>Warnings:</strong>{" "}
              {product.warnings || "Use as directed. Keep out of reach of children."}
            </p>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button onClick={() => handleQuantity("dec")}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantity("inc")}>+</button>
          </div>

          {/* Add to Cart */}
          <button className="buy-btn">Add to Cart</button>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Medical Products</h2>
          <div className="related-carousel">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                className="related-card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={typeof p.images[0] === "string" ? p.images[0] : p.images[0].url}
                  alt={p.name}
                />
                <h4>{p.name}</h4>
                <p>LKR {p.priceLKR}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
