import React from "react";
import { Link } from "react-router-dom";
import '../FooterSection/Foot.css'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Shield,
  Truck,
  Clock,
  Award,
} from "lucide-react";
import "../FooterSection/Foot.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="trust-container">
          <div className="trust-grid">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="trust-item"
            >
              <Shield className="trust-icon green" />
              <div>
                <p className="trust-title">FDA Approved</p>
                <p className="trust-sub">Licensed Pharmacy</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="trust-item">
              <Truck className="trust-icon blue" />
              <div>
                <p className="trust-title">Free Shipping</p>
                <p className="trust-sub">Orders over $50</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="trust-item">
              <Clock className="trust-icon purple" />
              <div>
                <p className="trust-title">24/7 Support</p>
                <p className="trust-sub">Always available</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="trust-item">
              <Award className="trust-icon yellow" />
              <div>
                <p className="trust-title">Trusted</p>
                <p className="trust-sub">10+ years serving</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="brand">
               
              <span className="brand-text">Nancee.lk</span>
            </div>
            <p className="brand-desc">
              Your trusted online pharmacy providing quality medicines and
              healthcare products with fast, reliable delivery.
            </p>
            <div className="social-links">
              <motion.a whileHover={{ scale: 1.1 }} href="#">
                <Facebook />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} href="#">
                <Twitter />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} href="#">
                <Instagram />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li>
                <Link to="/products">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=prescription">
                  Prescription Medicines
                </Link>
              </li>
              <li>
                <Link to="/products?category=otc">Over-the-Counter</Link>
              </li>
              <li>
                <Link to="/products?category=vitamins">
                  Vitamins & Supplements
                </Link>
              </li>
              <li>
                <Link to="/products?category=personal-care">
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-list">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Shipping Info</a>
              </li>
              <li>
                <a href="#">Returns & Refunds</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-info">
              <div>
                <Phone /> <span>+94702730134 Nancee pvt ltd</span>
              </div>
              <div>
                <Mail /> <span>support@nancee.com</span>
              </div>
              <div>
                <MapPin />{" "}
                <span>470, Panagoda , Homagama</span>
              </div>
            </div>
            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>
                Mon-Fri: 8:00 AM - 10:00 PM
                <br />
                Sat-Sun: 9:00 AM - 8:00 PM
                <br />
                <span className="online">24/7 Online Support</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © 2024 Nancee. All rights reserved. Licensed Pharmacy #la943
          </p>
          <div className="payments">
            <span>Payment Methods:</span>
            <div className="cards">
              <div className="card visa">COD</div>
               
              <div className="card amex">AMEX</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
