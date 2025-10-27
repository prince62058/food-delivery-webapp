import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>
            Welcome to our platform! We are dedicated to providing the best
            services with quality and reliability. Connect with us to explore
            exciting offerings and stay updated with our latest updates.
          </p>
          <div className="footer-social-icon">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* Centre Section */}
        <div className="footer-content-centre">
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-content-right">
         <h2>Get In Touch</h2>
         <ul>
            <li>+916205872519</li>
            <li>princekumar5252@gmail.com</li>
         </ul>
        </div>
      </div>
      <hr /> 
      <p className="footercopyright">
        &copy; Copyright 2025 © . All rights reserved.
      </p>
    </div>
  );
}

export default Footer;
