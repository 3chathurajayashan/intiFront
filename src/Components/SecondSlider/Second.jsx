import React, { useState, useRef, useEffect } from 'react';
import '../SecondSlider/Second.css';
import p6 from '../../Assests/y5.jpg';
import p7 from '../../Assests/d1.jpg';
import p8 from '../../Assests/y6.png';
import p9 from '../../Assests/pp3.jpg';
import p10 from '../../Assests/pp2.jpg'; // your 5th slide image

const AppleSlider = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const slides = [
    { id: 1, category: "Yoga care products", title: "Personal, private, powerful.", bgImage: p6, content: "Adorable features that understand you better" },
    { id: 2, category: "Nancee pet care ", title: "Keep your dog clean and clear with us", bgImage: p7, content: "We provide varience type of pet care vitamins" },
    { id: 3, category: "Prescription Service", title: "Take your familly doctors out and about.", bgImage: p8, content: "we always stay behind your health as a team" },
    { id: 4, category: "Medi Manifacuring", title: "Your Best and trusted medicine seller.", bgImage: p9, content: "Learn and grow with interactive products" },
    { id: 5, category: "for Least cost in Srilanka", title: "Kick back. Tune in. Stay Healthy.", bgImage: p10, content: "Immerse yourself in 100% healthy and active" }
  ];

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const scrollLeft = () => scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <div className="apple-slider">
      <div className="container">
        <h1 className="slider-title">Get to know Nancee.</h1>

        {canScrollLeft && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {canScrollRight && (
          <button className="scroll-button right" onClick={scrollRight}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div className="scroll-container" ref={scrollContainerRef}>
          {slides.map(slide => (
            <div
              key={slide.id}
              className="slide-card"
              style={{
                backgroundImage: `url(${slide.bgImage})`,
              }}
            >
              <div className="slide-card-overlay">
                <div className="slide-card-content">
                  <div>
                    <div className="slide-category">{slide.category}</div>
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-description">{slide.content}</p>
                  </div>

                   

                  <div className="plus-button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppleSlider;
