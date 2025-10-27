import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    window.location.reload();
  }

  return (
    <div className='navbar'>
       <img className='logo' src={assets.logo} alt="" />
       {!token ? <button onClick={() => alert('Please login to access admin panel')} className="sign-in-btn">Sign In</button>
       : <div className='navbar-profile'>
           <img className='profile' src={assets.profile_image} alt="" />
           <ul className='nav-profile-dropdown'>
             <li onClick={logout}><img src={assets.logout_icon} alt="" /> Logout</li>
           </ul>
         </div>
       }
    </div>
  )
}

export default Navbar