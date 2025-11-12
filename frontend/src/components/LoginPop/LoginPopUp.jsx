import React, { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { GoogleButton } from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../../firebase';

const LoginPopUp = ({ setshowLogin }) => {

  const { url, setToken } = useContext(StoreContext); // ✅ base URL aur setToken function context se liya

  const [currentState, setcurrentState] = useState("Login"); // ✅ current form state: "Login" ya "Sign Up"

  const [data, setData] = useState({ name: "", email: "", password: "" }); // ✅ user inputs store karne ke liye state

  const [showForgotPassword, setShowForgotPassword] = useState(false); // ✅ forgot password form state

  const [forgotEmail, setForgotEmail] = useState(""); // ✅ forgot password email state

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

const handleForgotPassword = async (event) => {
  event.preventDefault();
  if (!forgotEmail) {
    alert("Please enter your email");
    return;
  }
  try {
    const response = await axios.post(url + "/api/user/forgot-password", { email: forgotEmail });
    if (response.data.success) {
      alert("Password reset email sent. Check your inbox.");
      setShowForgotPassword(false);
      setForgotEmail("");
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    alert("Something went wrong. Please try again.");
  }
};

const handleGoogleSignIn = async () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({
    prompt: 'consent',
    access_type: 'offline'
  });
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Firebase user:", user);
    console.log("User email:", user.email);
    console.log("User displayName:", user.displayName);
    console.log("User uid:", user.uid);
    console.log("User providerData:", user.providerData);

    // Check if email is available from any provider data
    let email = user.email;
    if (!email && user.providerData && user.providerData.length > 0) {
      email = user.providerData[0].email;
    }

    if (!email) {
      console.error("No email found in user object or provider data");
      alert("Unable to retrieve email from Google. Please make sure your Google account has an email address and try again.");
      return;
    }

    // Here you can send the user info to your backend for authentication
    const response = await axios.post(url + "/api/user/google-login", {
      email: email,
      name: user.displayName || email.split('@')[0], // fallback to email prefix if no displayName
      uid: user.uid
    });
    console.log("Backend response:", response.data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setshowLogin(false);
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Google sign in error:", error);
    if (error.code === 'auth/popup-blocked') {
      alert("Popup was blocked by browser. Please allow popups and try again.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      alert("Sign-in popup was closed. Please try again.");
    } else if (error.code === 'auth/admin-restricted-operation') {
      alert("Google Sign-In is not enabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method.");
    } else {
      alert(`Google sign in failed: ${error.message}`);
    }
  }
};



  return (
    <div className='login-popup'>
      {showForgotPassword ? (
        <form onSubmit={handleForgotPassword} className="login-popup-container">
          <div className="login-popup-title">
            <h2>Forgot Password</h2>
            <img onClick={() => setShowForgotPassword(false)} src={assets.cross_icon} alt="" />
          </div>
          <div className="login-popup-inputs">
            <input
              name='email'
              onChange={(e) => setForgotEmail(e.target.value)}
              value={forgotEmail}
              type="email"
              placeholder='Enter your email'
              required
            />
          </div>
          <button type='submit'>Send Reset Email</button>
          <p>Remember your password? <span onClick={() => setShowForgotPassword(false)}>Back to Login</span></p>
        </form>
      ) : (
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

          {currentState === "Login" && (
            <div className="google-signin">
              <GoogleButton onClick={handleGoogleSignIn} />
            </div>
          )}



          {currentState === "Login" && (
            <p>Forgot your password? <span onClick={() => setShowForgotPassword(true)}>Reset here</span></p>
          )}

          {currentState === "Login" ?
            <p>Create a new account? <span onClick={() => setcurrentState("Sign Up")}>Click here</span></p> :
            <p>Already have an account? <span onClick={() => setcurrentState("Login")}>Login here</span></p>
          } {/* ✅ switch between Login/SignUp */}
        </form>
      )}
    </div>
  )
}

export default LoginPopUp; // ✅ component export
