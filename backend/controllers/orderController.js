import ordermodel from '../models/ordermodel.js';
import usermodel from '../models/usermodel.js';
import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
export const placeOrder = async (req, res) => {
  const frontend_url = "https://food-del-frontend-e4u5.onrender.com";
  try {
    const newOrder = new ordermodel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod || "stripe",
    })
    await newOrder.save();
    await usermodel.findByIdAndUpdate(req.body.userId, { cartData: {}, address: req.body.address });

    if (req.body.paymentMethod === "cod") {
      res.json({ success: true, message: "Order placed successfully with Cash on Delivery" })
    } else {
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name
          },
          unit_amount: item.price * 100  // Convert rupees to paisa
        },
        quantity: item.quantity
      }))

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charges"
          },
          unit_amount: 20 * 100  // Convert rupees to paisa
        },
        quantity: 1
      })

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      })

      res.json({ success: true, session_url: session.url })
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// verifying order
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await ordermodel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" })
    }
    else {
      await ordermodel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// user orders for frontend
export const userOrders = async (req, res) => {
  try {
    const orders = await ordermodel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

//Listing orders for admin pannel
export const listOrders = async(req,res)=>{
  try{
    const orders = await ordermodel.find({});
    res.status(201).json({success :true,data:orders})
  }catch(error){
   console.log(error);
   res.status(500).json({success:false,message:"Error"})
  }
}

//Updating order status
export const updateStatus = async(req,res)=>{
  try{
    await ordermodel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status Updated"})
  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//Cancel order
export const cancelOrder = async(req,res)=>{
  try{
    const order = await ordermodel.findById(req.body.orderId);
    if (!order) {
      return res.json({success:false,message:"Order not found"})
    }
    if (order.status !== "Food Processing") {
      return res.json({success:false,message:"Order cannot be canceled at this stage"})
    }
    await ordermodel.findByIdAndDelete(req.body.orderId);
    res.json({success:true,message:"Order Canceled"})
  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}
