import React, { useEffect, useRef } from 'react';
import '../BlackSection/Black.css';
import ap1 from '../../Assests/ap1.png';
import ap2 from '../../Assests/ap2.png';
import gmail from '../../Assests/gmail.png';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Black() {
  const animatedRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="blackMain">
      <div className="blackContent">
        <div className="titleBlack" ref={el => animatedRefs.current[0] = el}>
          <h1>Now we are available with 400+ <span className='spin'>authentic</span> products in Srilanka</h1>
          <h3>Freely discounted and get 12% discounts for your favorites from www.Nancee.lk</h3>
        </div>

        <div className="profileTitle" ref={el => animatedRefs.current[1] = el}>
          <div className="picture">
            <img src={gmail} className='gmail' alt="gmail"/>
          </div>
          <div className="subTitle">
            <h3>Wanna be a respective nancee customer ?</h3>
            <Link to="/page" className='sbs'>Subscribe us at $0 cost</Link>
          </div>
        </div>

        <button className='shopping' ref={el => animatedRefs.current[2] = el}>Shopping</button>
        <img src={ap1} className='ap1' ref={el => animatedRefs.current[3] = el} alt="app1"/>
        <img src={ap2} className='ap2' ref={el => animatedRefs.current[4] = el} alt="app2"/>

        <div className="socials" ref={el => animatedRefs.current[5] = el}>
          <h3>Now Reach us on</h3>
          <FaFacebookF className='ic' />
            <FaTwitter className='ic'/>
          <FaInstagram className='ic'/>
          <FaTwitter className='ic'/>
        </div>
      </div>
    </div>
  );
}

export default Black;