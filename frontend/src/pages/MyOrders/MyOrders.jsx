import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { authorization: `Bearer ${token}` } });
    setData(response.data.data);
  }

  const cancelOrder = async (orderId) => {
    const response = await axios.post(url + "/api/order/cancel", { orderId }, { headers: { authorization: `Bearer ${token}` } });
    if (response.data.success) {
      toast.success(response.data.message);
      fetchOrders(); // Refresh the orders list
    } else {
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity
                }
                else {
                  return item.name + " x " + item.quantity + ", "
                }
              })}</p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span className={`dot ${order.status.toLowerCase().replace(' ', '-')}`}></span> <b>{order.status}</b></p>
              <div className="order-actions">
                <button onClick={fetchOrders}>Track Order</button>
                {order.status === "Food Processing" && (
                  <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
