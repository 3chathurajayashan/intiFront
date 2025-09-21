import React, { useState, useEffect } from 'react'
import '../BodySection/Body.css'
import img1 from '../../Assests/travel.png'
import help from '../../Assests/help.png'
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Header from '../HeaderComponents/Header'
import vct1 from '../../Assests/v1.webp'
import { PiShoppingBagOpenThin } from "react-icons/pi";
 
import r8 from '../../Assests/s1.png'
import r82 from '../../Assests/s3.png'
import r83 from '../../Assests/s4.png'
 import Slider from '../SliderSection/Slider'

function Body() {
  const slides = [
    { image: r8, text: "Discover exclusive seasonal collections at Nancee.lk" },
    { image: r82, text: "Shop smart with flexible installment options" },
    { image: r83, text: "Premium products designed to elevate your lifestyle" }
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div>
      <Header />

      <div className="main">
        <div className="main-content">

          <div className="world">
            <img src={img1} alt='travel' className='image' />
            <h3>12+ Years of Excellence in Sri Lanka industry</h3>
          </div>

          <div className="title">
            <h1>Gear up every sason with <span className="na">Na</span><span className="nce">ncee</span> shopping,repeat again</h1>
            <h1 className='second'>Flexible installments for seasonal offers.</h1>
          </div>

          <div className="vectors">
            <img src={vct1} alt='travel' className='vct' />
          </div>

          <div className="para">
            <p><span className='coma'>“</span>At Nance.lk, we bring you a curated selection of premium products designed to 
              elevate your lifestyle. From the latest trends to timeless essentials, every 
              item is chosen with quality and style in mind. Experience seamless shopping, 
              Nance.lk is more than just a store—it’s your
              destination for convenience, sophistication, and exceptional service.<span className='coma'>”</span></p>
          </div>

          <div className="getbtn">
            <button>Shop Today <PiShoppingBagOpenThin className='icons' /></button>

            <div className="link">
              <div className="avatar">
                <img src={help} alt="help"/>
              </div>

              <div className="details">
                <h3>Need a shopping help ?</h3>
                <Link to="/page" className='arrow'>Ask Nancee shopping specialist <HiOutlineArrowSmRight className='arr' /></Link>
              </div>
            </div>
          </div>

          {/* sliding carousel */}
          <div className="mainImage">
            <div 
              className="slider-wrapper"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div className="slide" key={index}>
                  <img src={slide.image} alt="slider" />
                  <p className="slider-text">{slide.text}</p>
                </div>
              ))}
            </div>
          </div>
 <div className="trust">
        <h1>Trusted By</h1>
       </div>

        </div>
      </div>
       
       
      
    </div>
  )
}

export default Body
