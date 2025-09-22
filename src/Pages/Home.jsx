import React, { useEffect, useState } from 'react';
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
import Test from '../Components/TestSection/Test';
import Footer from '../Components/FooterSection/Footer';
import ArrowUp from '../Assests/arrowUp.png'; // Your arrow icon

function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll animations initialization
    const initScrollAnimations = () => {
      if (typeof window.initScrollAnimations === 'function') {
        window.initScrollAnimations();
      }
      window.dispatchEvent(new Event('scroll'));
    };
    initScrollAnimations();

    const observer = new MutationObserver(initScrollAnimations);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Scroll-to-top icon logic
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollPosition > pageHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Fixed bottom buttons */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <Link 
          to="/signup" 
          style={{ padding: '10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          Sign up
        </Link>

        {/* Scroll-to-top icon */}
        {showScrollTop && (
          <img 
            src={ArrowUp} 
            alt="Scroll to top" 
            onClick={scrollToTop} 
            style={{ width: '40px', height: '40px', cursor: 'pointer', transition: 'transform 0.3s', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
