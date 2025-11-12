import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { useContext } from 'react';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const [data, setData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage("Invalid reset link");
    }
  }, [searchParams]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (data.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(url + "/api/user/reset-password", {
        token: token,
        newPassword: data.password
      });

      if (response.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="reset-password">
      <form onSubmit={onSubmit} className="reset-password-container">
        <div className="reset-password-title">
          <h2>Reset Password</h2>
        </div>

        <div className="reset-password-inputs">
          <input
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder='New Password'
            required
          />
          <input
            name='confirmPassword'
            onChange={onChangeHandler}
            value={data.confirmPassword}
            type="password"
            placeholder='Confirm New Password'
            required
          />
        </div>

        <button type='submit' disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
