import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './components/Cart/Cart';
import Verify from './components/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import Footer from './components/Footer/Footer';
import { useState} from 'react';
import LoginPopUp from './components/LoginPop/LoginPopUp';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import ResetPassword from './components/ResetPassword/ResetPassword';




const App = () => {
  const [showLogin , setshowLogin] =  useState(false);
 
  return (
    <>
    {showLogin? <LoginPopUp setshowLogin={setshowLogin}/> : <></> }
    <ToastContainer/>
      <div className="app">
        <Navbar  setshowLogin = {setshowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>

      <Footer /> {/* Now outside .app but still valid JSX */}
    </>
  );
};

export default App;
