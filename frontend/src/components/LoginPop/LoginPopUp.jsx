import React, { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';

const LoginPopUp = ({ setshowLogin }) => {

  const { url, setToken } = useContext(StoreContext); // ✅ base URL aur setToken function context se liya

  const [currentState, setcurrentState] = useState("Login"); // ✅ current form state: "Login" ya "Sign Up"

  const [data, setData] = useState({ name: "", email: "", password: "" }); // ✅ user inputs store karne ke liye state

  const onChangerHandler = (e) => { 
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  }

const onLogin=async(event)=>{
event.preventDefault();
let newUrl = url;
if(currentState === "Login"){
  newUrl += "/api/user/login"
}else{
   newUrl += "/api/user/register"
}
const response =  await axios.post(newUrl,data)
if (response.data.success) {
  setToken(response.data.token)
  localStorage.setItem("token",response.data.token);
  setshowLogin(false)

}else{
  alert(response.data.message);
}
}

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setshowLogin(false)} src={assets.cross_icon} alt="" /> {/* ✅ close icon */}
        </div>

        <div className="login-popup-inputs">
          {currentState === "Sign Up" && <input name='name' onChange={onChangerHandler} value={data.name} type="text" placeholder='Your name' required />} {/* ✅ name input */}
          <input name='email' onChange={onChangerHandler} value={data.email} type="email" placeholder='Your email' required /> {/* ✅ email input */}
          <input name='password' onChange={onChangerHandler} value={data.password} type="password" placeholder='Your password' required /> {/* ✅ password input */}
        </div>

        <button type='submit'>{currentState === "Sign Up" ? "Create account" : "Login"}</button> {/* ✅ button text change */}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p> {/* ✅ terms checkbox */}
        </div>

        {currentState === "Login" ?
          <p>Create a new account? <span onClick={() => setcurrentState("Sign Up")}>Click here</span></p> :
          <p>Already have an account? <span onClick={() => setcurrentState("Login")}>Login here</span></p>
        } {/* ✅ switch between Login/SignUp */}
      </form>
    </div>
  )
}

export default LoginPopUp; // ✅ component export
