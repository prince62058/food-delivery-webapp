import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url, _id, userAddresses, selectedAddress, setSelectedAddress, addUserAddress, deleteUserAddress } = useContext(StoreContext);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    console.log("Saving address:", data);
    const result = await addUserAddress(data);
    console.log("Save result:", result);
    if (result.success) {
      toast.success("Address saved successfully");
      setIsEditing(false);
      setData({
        firstname: "",
        lastname: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
      });
    } else {
      toast.error(result.message || "Failed to save address");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit, reset to selectedAddress
      setData(selectedAddress);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteAddress = async (index) => {
    const result = await deleteUserAddress(index);
    if (result.success) {
      toast.success("Address deleted successfully");
    } else {
      toast.error(result.message || "Failed to delete address");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (getTotalCartAmount() === 0) return;

    setLoading(true);

    // Always save address to user profile on order placement
    console.log("Placing order, saving address:", data);
    await addUserAddress(data);

    const orderItem = [];
    food_list.forEach(item => {
      if (cartItems[item._id] > 0) {
        orderItem.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const orderData = {
      userId: _id,
      address: data,
      items: orderItem,
      amount: getTotalCartAmount() + 2,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        if (paymentMethod === "cod") {
          navigate("/myorders");
        } else {
          const { session_url } = response.data;
          window.open(session_url, '_blank');
        }
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while placing the order.");
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  useEffect(() => {
    // Pre-fill form with selected address
    setData(selectedAddress);
  }, [selectedAddress]);

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="address-actions">
          <button type="button" onClick={() => setShowAddressList(!showAddressList)} className="select-address-btn">
            Select Saved Address
          </button>
          <button type="button" onClick={handleEditToggle} className="edit-address-btn">
            {isEditing ? "Cancel Edit" : "Add New Address"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleSaveAddress} className="save-address-btn">
              Save Address
            </button>
          )}
        </div>
        {showAddressList && userAddresses.length > 0 && (
          <div className="saved-addresses">
            <h4>Saved Addresses</h4>
            {userAddresses.map((addr, index) => (
              <div key={index} className={`saved-address ${selectedAddress === addr ? 'selected' : ''}`}>
                <div className="address-content" onClick={() => setSelectedAddress(addr)}>
                  <p>{addr.firstname} {addr.lastname}</p>
                  <p>{addr.street}, {addr.city}, {addr.state} {addr.zipcode}</p>
                  <p>{addr.country} - {addr.phone}</p>
                </div>
                <button type="button" className="delete-address-btn" onClick={() => handleDeleteAddress(index)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        <div className="multifield">
          <input required name='firstname' onChange={onChangeHandler} value={data.firstname} type="text" placeholder='First Name' disabled={!isEditing} />
          <input required name='lastname' onChange={onChangeHandler} value={data.lastname} type="text" placeholder='Last Name' disabled={!isEditing} />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' disabled={!isEditing} />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' disabled={!isEditing} />
        <div className="multifield">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' disabled={!isEditing} />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' disabled={!isEditing} />
        </div>
        <div className="multifield">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' disabled={!isEditing} />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' disabled={!isEditing} />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' disabled={!isEditing} />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 10}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 10}</b>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <div 
                className={`payment-card ${paymentMethod === "cod" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="payment-icon"></div>
                <span className="payment-label">COD ( Cash on delivery )</span>
              </div>
              <div 
                className={`payment-card ${paymentMethod === "stripe" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <div className="payment-icon"></div>
                <span className="payment-label">Stripe ( Credit / Debit )</span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={getTotalCartAmount() === 0 || loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;