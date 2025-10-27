import { GenerateWebTokenAndSaveCookie } from "../JWT/Token.js";
import { validateUser } from "../models/usermodel.js";
import usermodel from '../models/usermodel.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        // Validate User
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extract data
        const { name, email, password } = req.body;

        // Check if User already exists
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a New User
        const newUser = new usermodel({ name, email, password: hashedPassword });
        await newUser.save();

        if (newUser) {
            const token = await GenerateWebTokenAndSaveCookie(newUser._id, res);
            return res.status(201).json({ success:true, message: "User created successfully", newUser, token });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await usermodel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = await GenerateWebTokenAndSaveCookie(user._id, res);

    // Send token in response
    res.status(200).json({ success: true, message: "User logged in successfully", user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
