import React, { useState, useEffect } from 'react';
import '../TestSection/Test.css';
import { FaHeadset, FaTruck, FaShieldAlt, FaGift } from "react-icons/fa";
import sld1 from '../../Assests/p8.jpg';
import ab1 from '../../Assests/ab7.jpeg';
import ab2 from '../../Assests/ab8.jpeg';
import ab3 from '../../Assests/ab9.jpg';
import ab4 from '../../Assests/ab4.jpg';
import ab5 from '../../Assests/ab3.jpg';
import ab6 from '../../Assests/gg1.jpg';

import cs1 from '../../Assests/cs1.png';
import cs2 from '../../Assests/cs2.png';
import cs3 from '../../Assests/cs3.png';
import cs4 from '../../Assests/cs4.png';
 
 
const AppleServicesClone = () => {
  const [activeService, setActiveService] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

const servicess = [
  { id: 1, title: "24/7 Support", color: "#ffffff", icon: <img src={cs1} alt="24/7 Support" className="serviceImg" /> },
  { id: 2, title: "Fast Delivery", color: "#ffffff", icon: <img src={cs2} alt="Fast Delivery" className="serviceImg" /> },
  { id: 3, title: "Secure Payment", color: "#ffffff", icon: <img src={cs3} alt="Fast Delivery" className="serviceImg" /> },
  { id: 4, title: "Special Offers", color: "#ffffff", icon: <img src={cs4} alt="Fast Delivery" className="serviceImg" /> }
];
  // Service data
  const services = [
    {
      id: 1,
      title: "Colombo Central Hospitals",
      description: "The program featured an engaging session led by Dr. Ravi Jayawardana, Consultant Physician attached to NHSL and the National Eye Hospital. His keynote address focused on diabetes awareness, prevention strategies, and practical health tips, followed by an interactive Q&A sessions.",
      features: ["100+ million invests", "providing free services for 1 year", "help in real-time", "Listen across all our devices"],
      color: "#FFFFFF",
      image: ab1
    },
    {
      id: 2,
      title: "Asiri Central Hospitals Metro",
      description:  "At Asiri Health, we believe a healthier workforce builds a stronger nation. By partnering with forward-thinking corporates like Seylan Bank, we are empowering employees to prioritize their health. Together we are shaping a healthier tomorrow.",
      features: ["100+ electronic beds", "Nancee emergency Service", "Watch offline", "Family sharing"],
     color: "#FFFFFF",
      image:  ab2
    },
    {
      id: 3,
      title: "10 Years of Excellence ceremony Colombo",
      description: "This impactful program was planned and coordinated by Ms. Iroshini, Manager Employee Engagement at Seylan Bank, and Ms. Natasha, Assistant Manager Corporate Services at Asiri Health. Their collaborative efforts ensured the session’s success.",
      features: ["200+ exclusive family games", "No ads or in-app purchases", "Book across devices", "12+ Certificates for Nancee.lk"],
       color: "#FFFFFF",
      image: ab3
    },
    {
      id: 4,
      title: "Medi Help Conference at BMICH",
      description: "We are honored to collaborate with organizations like Seylan Bank, whose vision aligns with ours in fostering healthier lifestyles for their teams. Together, we’re not just addressing the challenges of today but building a stronger, healthier Sri Lanka for tomorrow.",
      features: ["5GB free storage", "Keep data safe and updated", "Share with family", "Access from any device"],
       color: "#FFFFFF",
      image: ab4
    },
    {
      id: 5,
      title: "Medi Expo 2024 Grand ceremony at Townhall",
      description: "We are thrilled to announce that in the recent surveys conducted by Great Place to Work Sri Lanka, with full participation from all employees of Asiri Central Hospital and Asiri Hospital Kandy Hospitals are eligible to receive Great Place to Work certification. ",
      features: ["Awarded as best medi partner in SriLanka", "Product integration", "New workouts each week", "Share with up to 5 family members"],
       color: "#FFFFFF",
      image:  ab5
    },
    {
      id: 6,
      title: "Meet up with Our Dedicated Crew at Durdans Hospitals",
      description: "Asiri Hospital Kandy is the only tertiary care, largest, fully fledged private Hospital in Kandy that offers treatment in multi-disciplinary areas with 147 beds which is purposely built.",
      features: ["300+ magazines", "Leading newspapers", "Audio stories", "50Million invests"],
      color: "#FFFFFF",
      image:  ab6
    }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate services
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [services.length]);

  const handleServiceChange = (index) => {
    setActiveService(index);
  };

  const handlePrevService = () => {
    setActiveService((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNextService = () => {
    setActiveService((prev) => (prev + 1) % services.length);
  };

  return (
    <div className="pageContainer">
      {/* Hero Section with background image */}
      <section 
        className="heroSection" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${services[activeService].image})`,
          backgroundColor: services[activeService].color
        }}
      >
        <div className="heroContent">
          <h1 className="heroTitle">Why you choose Nancee ?</h1>
          <p className="heroDescription">The ultimate collection of Collaborations. All your hard works. One seamless experience.</p>
        </div>
        
        {/* Slider navigation arrows */}
        <div className="heroNav">
          <button className="navArrow prev" onClick={handlePrevService}>
            <span>&#8249;</span>
          </button>
          <button className="navArrow next" onClick={handleNextService}>
            <span>&#8250;</span>
          </button>
        </div>
        
        {/* Slider indicators */}
        <div className="heroIndicators">
          {services.map((service, index) => (
            <button
              key={service.id}
              className={`indicator ${index === activeService ? 'active' : ''}`}
              onClick={() => handleServiceChange(index)}
              style={{ backgroundColor: index === activeService ? service.color : 'rgba(255, 255, 255, 0.5)' }}
            />
          ))}
        </div>
      </section>

      {/* Services Showcase */}
      <section className="servicesShowcase">
        <div className="serviceViewer">
          <div className="serviceDisplay" style={{ backgroundColor: services[activeService].color }}>
            <div className="serviceInfo">
              <h2>{services[activeService].title}</h2>
              <p>{services[activeService].description}</p>
              <ul className="featureList">
                {services[activeService].features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="actionButtons">
                <button className="primaryButton">Read more</button>
                <button className="secondaryButton">Donate us</button>
              </div>
            </div>
            <div className="serviceImage">
              <img src={services[activeService].image} alt={services[activeService].title} />
            </div>
          </div>

          <div className="serviceSelector">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`serviceOption ${index === activeService ? 'isActive' : ''}`}
                onClick={() => handleServiceChange(index)}
                style={{ borderLeft: index === activeService ? `4px solid ${service.color}` : '4px solid transparent' }}
              >
                <div className="optionIndicator" style={{ backgroundColor: service.color }}></div>
                <span>{service.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Grid */}
      <section className="allServices">
        <h2 className="sectionHeading">All Nancee Collaborations</h2>
        <div className="servicesGrid">
          {services.map(service => (
            <div key={service.id} className="serviceCard" style={{ '--card-color': service.color }}>
              <div className="cardVisual">
                <div className="colorAccent" style={{ backgroundColor: service.color }}></div>
                <img src={service.image} alt={service.title} />
              </div>
              <div className="cardContent">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button className="cardButton">Learn more</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family Sharing Section */}
      <section className="familySharing">
        <div className="sharingContent">
          <div className="sharingInfo">
            <h2>Face an Any Issue During Shopping Time ?</h2>
            <p>Team Nancee is always there for your assistance 24/7.Reach us by filling few things.</p>
            <button className="primaryButton">Submit Complain Form</button>
          </div>
   <div className="sharingVisual">
  {servicess.slice(0, 4).map(service => (
    <div key={service.id} className="sharedService" style={{ backgroundColor: service.color }}>
      <div className="serviceIcon">{service.icon}</div>
      <span>{service.title}</span>
    </div>
  ))}
</div>


        </div>
      </section>

      {/* Footer */}
      <footer className="pageFooter">
        <p>More ways to shop: Find an Nancee Store or other retailer near you. Or call 0774306758.</p>
        <div className="footerLinks">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Sales and Refunds</a>
          <a href="#">Legal</a>
          <a href="#">Site Map</a>
        </div>
        <p className="copyright">Copyright © 2023 Nancee private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AppleServicesClone;