import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import Header from '../Components/HeaderComponents/Header';
import Product from '../Components/ProductSection/Product';
import Slider from '../Components/SliderSection/Slider';
import Body from '../Components/BodySection/Body';
import Baby from '../Components/BabySection/Baby';
import IdeasSection from '../Components/IdeasSection/Idea';
import Second from '../Components/SecondSlider/Second';
import Black from '../Components/BlackSection/Black';
import Third from '../Components/ThirdSection/Third';
 import Test from '../Components/TestSection/Test'
import Footer from '../Components/FooterSection/Footer';
 

function Home() {
  useEffect(() => {
    // Reinitialize scroll animations after all components are mounted
    const initScrollAnimations = () => {
      // This function will be called when the page loads and after each render if needed
      if (typeof window.initScrollAnimations === 'function') {
        window.initScrollAnimations();
      }
      
      // Alternative: manually trigger scroll events if your animations are based on scroll position
      window.dispatchEvent(new Event('scroll'));
    };

    // Initialize on component mount
    initScrollAnimations();

    // Set up a mutation observer to reinitialize when DOM changes
    const observer = new MutationObserver(initScrollAnimations);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <Body />
        <Slider />
        <Baby />
        <Product />
        <Third />
        <IdeasSection />
        <Second />
        <Black />
        <Test />
        <Footer />
       
       
      </div>

      <Link to="/userProfile">userProfile</Link>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Link to="/signup" style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Sign up
        </Link>
        <Link to="/logins" style={{ padding: '10px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          User Sign in
        </Link>
      </div>
    </div>
  );
}

export default Home;