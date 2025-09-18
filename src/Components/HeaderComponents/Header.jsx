import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  User,
  Phone,
} from "lucide-react";
import "../HeaderComponents/Header.css";

// ✅ Temporary mock hook (replace with your shop context later)
const useShop = () => {
  return {
    getCartItemsCount: () => 2, // mock cart count
    wishlistItems: [1, 2], // mock wishlist items
  };
};

// ✅ Reusable Button
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "default",
  size = "default",
}) => {
  let base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variants =
    variant === "ghost"
      ? "bg-transparent hover:bg-gray-100 text-gray-700"
      : "bg-blue-600 text-white hover:bg-blue-700";
  let sizes = size === "icon" ? "p-2" : "px-4 py-2";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants} ${sizes} ${className}`}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getCartItemsCount, wishlistItems } = useShop();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleProfile = () => {
    alert("🚧 Profile not implemented yet!");
  };

  return (
    <header className="header">
      {/* 🔹 Top Bar */}
      <div className="top-bar">
        <div className="container flex-between">
          <div className="flex items-center gap-2">
            <Phone className="icon-sm" /> 24/7 Support: +94-800-Nancee Pvt
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>Free shipping on orders over 6500RS</span> •{" "}
            <span>Licensed Company</span>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <div className="container main-header">
        <Link to="/" className="logo-link flex items-center gap-2">
          <div>
            <h1 className="text-4xl font-bold gradient-text log">
              <span className="na">Na</span>
              <span className="nce">ncee</span>
            </h1>
            <p className="text-1xl text-gray-500">Your Trusted Excellence!</p>
          </div>
        </Link>

        {/* Search (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-lg mx-8"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, health products..."
              className="search-input"
            />
            <Search className="search-icon" />
            <Button type="submit" className="search-btn">
              Search
            </Button>
          </div>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="hidden md:flex relative">
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="badge wishlist-badge">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* User */}
          <Link to="/login">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="w-6 h-6" />
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {getCartItemsCount() > 0 && (
                <span className="badge cart-badge">
                  {getCartItemsCount()}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Search (Mobile) */}
      <form onSubmit={handleSearch} className="md:hidden mt-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines..."
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
      </form>

      {/* 🔹 Nav Links */}
      <div className="linksSec">
        <nav className="contentlinks">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            All Products
          </Link>
          <Link to="/products?category=prescription" className="nav-link">
            Prescription
          </Link>
          <Link to="/products?category=otc" className="nav-link">
            Over-the-Counter
          </Link>
          <Link to="/products?category=vitamins" className="nav-link">
            Vitamins & Supplements
          </Link>
          <Link to="/products?category=personal-care" className="nav-link">
            Personal Care
          </Link>
        </nav>
      </div>

      {/* 🔹 Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/products" className="nav-link">
              All Products
            </Link>
            <Link to="/wishlist" className="nav-link">
              Wishlist
            </Link>
            <Link to="/products?category=prescription" className="nav-link">
              Prescription
            </Link>
            <Link to="/products?category=otc" className="nav-link">
              Over-the-Counter
            </Link>
            <Link to="/products?category=vitamins" className="nav-link">
              Vitamins & Supplements
            </Link>
            <Link to="/products?category=personal-care" className="nav-link">
              Personal Care
            </Link>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-6 h-6" />
                  {wishlistItems.length > 0 && (
                    <span className="badge wishlist-badge-mobile">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleProfile}>
                <User className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
