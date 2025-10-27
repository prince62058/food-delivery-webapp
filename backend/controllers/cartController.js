// cartController.js
import usermodel from "../models/usermodel.js";

// Add item to user cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await usermodel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await usermodel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


// Remove item from user cart
export const removeFromCart = async (req, res) => {
  try {
    const userData = await usermodel.findById(req.body.userId);
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] -= 1;

      if (cartData[req.body.itemId] <= 0) {
        delete cartData[req.body.itemId]; // remove completely if quantity 0
      }

      await usermodel.findByIdAndUpdate(req.body.userId, { cartData });
      return res
        .status(200)
        .json({ success: true, message: "Item removed from cart" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Item not in cart" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userData = await usermodel.findById(req.body.userId);
    const cartData = userData.cartData || {};
    res.status(200).json({ success: true, cart: cartData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
