import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const Navbar = ({ setshowLogin }) => {
  const [menu, setmenu] = useState("Home");
  const { getTotalCartAmount ,token,setToken} = useContext(StoreContext);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const handleScroll = () => setScrolled(window.scrollY > 50);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    setmenu("Home");                                // Set active menu
    setScrolled(false);                             // Reset navbar to normal
  } 

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to='/' onClick={scrollToTop}><img src={assets.logo} alt="Logo" className="logo" /></Link>

      {/* Menu */}
      <ul className="navbar-menu">
        <Link to='/' onClick={scrollToTop} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={() => setmenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        <a href="#app-download" onClick={() => setmenu("Mobile-App")} className={menu === "Mobile-App" ? "active" : ""}>Mobile App</a>
        <a href="#footer" onClick={() => setmenu("Contact-Us")} className={menu === "Contact-Us" ? "active" : ""}>Contact Us</a>
      </ul>

      {/* Right */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" className="search-icon" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="Basket" className="basket-icon" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? <button onClick={() => setshowLogin(true)} className="sign-in-btn">Sign In</button>
        : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='nav-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /> Orders</li>
              <hr />
              <li onClick={() => window.open('https://food-delivery-admin-5it0.onrender.com', '_blank')}><img src={assets.profile_icon} alt="" /> Admin</li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /> Logout</li>


            </ul>

          </div>
      }
        
      </div>
    </div>
  );
};

export default Navbar;
