import React, {  useState } from "react";
import "../SliderSection/Slider.css";
import sl1 from '../../Assests/sl1.png';
import sl2 from '../../Assests/sl2.png';
import sl3 from '../../Assests/sl3.jpeg';
import sl4 from '../../Assests/sl4.png';
import sl5 from '../../Assests/sl5.png';
import sl6 from '../../Assests/sl6.png';
import sl7 from '../../Assests/sl7.jpg';
import sl18 from '../../Assests/sl18.png';
import sl10 from '../../Assests/sl10.png';
import sl11 from '../../Assests/sl11.jpg';
import sl12 from '../../Assests/sl12.png';
import sl13 from '../../Assests/sl13.jpg';
const logos = [sl1, sl2, sl3, sl4, sl5, sl6, sl7, sl18,sl11,sl12,sl13];

export default function LogoSlider() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="apple-slider-container">
      <div 
        className="logo-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`slider-track ${isPaused ? 'paused' : ''}`}>
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div className="logo-item" key={`first-${index}`}>
              <img src={logo} alt={`logo-${index}`} />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div className="logo-item" key={`second-${index}`}>
              <img src={logo} alt={`logo-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}