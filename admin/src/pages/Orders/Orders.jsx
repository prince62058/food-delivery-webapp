import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import  { useEffect } from 'react'
import  { assets } from '../../assets/assets'
const Orders = ({Url}) => {

 const [orders , setOrders] = useState([]);

 const fetchAllOrders = async()=>{
      const response = await axios.get(`${Url}/api/order/list`);
      if(response.data.success){
        setOrders(response.data.data);
        console.log(response.data.data);
      }else{
        toast.error(response.data.message);
      }
 }

 const statusHandler = async (event,orderId) => {
  const response = await axios.post(`${Url}/api/order/status`,{
    orderId,
    status:event.target.value
  })
  if (response.data.success) {
    await fetchAllOrders();
  }
 }

 const removeOrder = async (orderId) => {
  const response = await axios.post(`${Url}/api/order/remove`,{
    orderId
  })
  if (response.data.success) {
    toast.success(response.data.message);
    await fetchAllOrders();
  } else {
    toast.error(response.data.message);
  }
 }

 useEffect(()=>{
  fetchAllOrders();
 },[])
 
  return ( 
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>{
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item,index)=>{
                    if(index === order.items.length - 1){
                      return item.name + " (" + item.quantity + " x " + item.price + " Rs)"
                    }else{
                      return item.name + " (" + item.quantity + " x " + item.price + " Rs), "
                    }
                  }).join('')}
                </p>
                <p className='order-item-name'>{order.address.firstname + " " + order.address.lastname}</p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button onClick={() => removeOrder(order._id)} className="remove-btn">Remove</button>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Orders