import React, { useState, useEffect, useRef } from 'react';
import './Third.css';
import img99 from '../../Assests/o2.webp';
import v1 from '../../Assests/vd4.mp4';
import p1 from '../../Assests/ls6.png';
import p2 from '../../Assests/ls5.png';
import p3 from '../../Assests/ls7.png';

const Third = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Preload the main image
    const img = new Image();
    img.src = img99;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger animations when this section is in view
        setIsInView(entry.isIntersecting);
        
        // Play video when in view, pause when out of view
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(e => console.log("Video play failed:", e));
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!sectionRef.current || !isInView) return;
      
      const section = sectionRef.current;
      
      // Calculate progress based on how much of this section is in view
      const scrollPosition = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      const progress = Math.max(0, Math.min(1, (scrollPosition - sectionTop + window.innerHeight * 0.5) / (sectionHeight * 0.7)));
      setScrollProgress(progress);
      
      // Apply transformations only when section is in view
      if (imageRef.current && isInView && isImageLoaded) {
        const image = imageRef.current;
        const rotateX = progress * -15;
        const rotateY = progress * 5;
        const scale = 1 + progress * 0.2;
        const translateY = progress * -100;
        
        image.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale(${scale})
          translateY(${translateY}px)
        `;
        
        image.style.opacity = 1 - (progress * 0.3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger once on mount to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isInView, isImageLoaded]);

  const features = [
    {
      title: "Garnier Full brightning Range",
      description: " Garnier vitamin C bodyLotion range from Nancee.lk",
      image: p1,
      price: "රු. 149.99 /="
    },
    {
      title: "MamaEarth Value combo pack",
      description: "get 56% off by puchasing mamaearth products",
      image: p2,
      price: "රු .129.99 /="
    },
    {
      title: "Vaselin Gluta-hya non-sticky",
      description: "Delivers instantaneous experiences with Vaselin",
      image: p3,
      price: "රු .199.99 /="
    }
  ];

  return (
    <section className="third-section" ref={sectionRef}>
      <div className="apple-vision-pro">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <div className="hero-logo">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <path d="M40,10C23.4,10,10,23.4,10,40s13.4,30,30,30s30-13.4,30-30S56.6,10,40,10z M40,65c-13.8,0-25-11.2-25-25S26.2,15,40,15 s25,11.2,25,25S53.8,65,40,65z" />
                <path d="M40,20c-11,0-20,9-20,20s9,20,20,20s20-9,20-20S51,20,40,20z M40,55c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15 S48.3,55,40,55z" />
                <path d="M40,30c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S45.5,30,40,30z M40,45c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5 S42.8,45,40,45z" />
              </svg>
            </div>
            <h1 className="hero-title">Introducing Skin care</h1>
            <h2 className="hero-subtitle">Welcome to the era of Vitamins.</h2>
            <div className="hero-actions">
              <a href="#learn-more" className="hero-link">Learn more</a>
              <a href="#buy" className="hero-link">Notify me</a>
            </div>
          </div>
          <div className="hero-media">
            <div className={`hero-image-container ${isImageLoaded ? 'loaded' : ''}`}>
              <img 
                ref={imageRef}
                src={img99} 
                alt="Apple Vision Pro" 
                className="hero-image"
                style={{
                  opacity: isImageLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
              {!isImageLoaded && (
                <div className="image-placeholder">
                  Loading...
                </div>
              )}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-line">
              <div 
                className="scroll-progress" 
                style={{ transform: `scaleY(${scrollProgress})` }}
              ></div>
            </div>
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* Intro Section */}
        <div className="intro">
          <div className="intro-content">
            <p className="intro-text">
               We are Introducing Our All-New Skincare Sets – 
               Elevate Your Glow and Treat Your Skin to the Care It Deserves!
            </p>
          </div>
        </div>

        {/* Features Section with Image Cards */}
        <div className="features">
          <div className="features-container">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-image-container">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="feature-image"
                  />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-price">{feature.price}</div>
                  <button className="shop-now-btn">Shop Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Section with Full-Width Video */}
        <div className="media-showcase">
          <div className="media-content">
            <h2 className="media-title">An immersive way to experience Skin Care Treatments</h2>
            <p className="media-description">
              "Nancee skin care products – High-quality care for your skin at budget-friendly prices. Get glowing skin, a fresh new feeling, and special care every day!"
            </p>
          </div>
          <div className="video-container">
            <video
              ref={videoRef}
              className="full-width-video"
              src={v1}
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="video-overlay">
              <div className="video-caption">Spatial videos come alive</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Third;