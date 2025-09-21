import React, { useEffect } from "react";
import "../BabySection/Baby.css";
import { IoIosArrowRoundForward } from "react-icons/io";
import wave from "../../Assests/wave.svg";
import { IoMdHeartEmpty } from "react-icons/io";
import { CheckCircle } from "lucide-react";
import png from "../../Assests/bb1.png";
import logo from "../../Assests/logo.png";
import bb2 from "../../Assests/bb2.png";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Baby() {
  const features = [
    "100% Natural & Organic Ingredients",
    "Dermatologically Tested Formula",
    "Pediatrician Recommended",
    "Eco-Friendly Packaging",
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <div className="babyMain">
      <div className="babyContent">
        <div className="bTitle" data-aos="fade-right">
          <h1>
            Elevating Baby Care to ultra premium standards with BabyCheramy
            products
          </h1>
          <h3>Nancee always brings 100% natural baby care treatments.</h3>
        </div>

        <div className="paragraph" data-aos="fade-up">
          <div className="heart">
            <IoMdHeartEmpty className="hrt" />
          </div>
          <p>
            Learn more about the little one who is growing up. Here’s what you
            need to learn about the first two years of your toddler which is a
            very important period in their growth and development.
          </p>
        </div>

        <div className="btnss" data-aos="fade-up" data-aos-delay="200">
          <button>Visit online store</button>
          <Link to="/page" className="btlink">
            Explore our social media
          </Link>
          <IoIosArrowRoundForward className="arrw" />
        </div>

        <div className="features-section" data-aos="fade-up" data-aos-delay="400">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item" data-aos="zoom-in" data-aos-delay={index * 200}>
                <CheckCircle className="feature-icon" />
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <img src={wave} className="svg" alt="wave" />
      <img src={png} className="png" alt="baby png" data-aos="fade-left" />
      <img src={logo} className="lgo" alt="logo" data-aos="fade-down" />
      <img src={bb2} className="bb2" alt="baby bb2" data-aos="fade-up" />
    </div>
  );
}

export default Baby;
