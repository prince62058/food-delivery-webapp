import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './components/Cart/Cart';
import Verify from './components/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import Footer from './components/Footer/Footer';
import { useState,useContext} from 'react';
import LoginPopUp from './components/LoginPop/LoginPopUp';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import { StoreContext } from './components/context/StoreContext';



const App = () => {
  const [showLogin , setshowLogin] =  useState(false);
  const { loading } = useContext(StoreContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#333'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
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
        </Routes>
      </div>

      <Footer /> {/* Now outside .app but still valid JSX */}
    </>
  );
};

export default App;
