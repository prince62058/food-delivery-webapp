import fs from 'fs';
import foodmodel from '../models/foodmodel.js';

// ✅ Add food
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    if (!image_filename) {
      return res.status(400).json({ success: false, message: "Image is required!" });
    }

    const food = new foodmodel({
      name,
      description,
      price,
      category,
      image: image_filename
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food added successfully!", food });
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ success: false, message: "Error adding food", error: error.message });
  }
};

// ✅ List all foods
export const listFood = async (req, res) => {
  try {
    const foods = await foodmodel.find({});
    res.status(200).json({ success: true, data: foods, message: 'Food list fetched successfully' });
  } catch (error) {
    console.error('Error fetching food list:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while fetching the food list' });
  }
};

// ✅ Remove food
export const removeFood = async (req, res) => {
  try {
    const food = await foodmodel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found!" });
    }

    // Delete image from uploads folder
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.log("Error deleting image:", err);
      else console.log("Image deleted successfully");
    });

    // Delete food from database
    await foodmodel.findByIdAndDelete(req.body.id);

    res.status(200).json({ success: true, message: "Food item deleted successfully!" });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ success: false, message: "Server error while deleting food" });
  }
};
