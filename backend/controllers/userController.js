import { GenerateWebTokenAndSaveCookie } from "../JWT/Token.js";
import { validateUser } from "../models/usermodel.js";
import usermodel from '../models/usermodel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
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



export const getProfile = async (req, res) => {
  try {
    const user = await usermodel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;
    console.log("Adding address for user", userId, address);
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.addresses.push(address);
    await user.save();
    console.log("Address added successfully for user", userId);
    res.status(200).json({ success: true, message: "Address added successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await usermodel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;
    console.log("Updating address for user", userId, address);
    const user = await usermodel.findByIdAndUpdate(userId, { address }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("Address updated successfully for user", userId);
    res.status(200).json({ success: true, message: "Address updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressIndex } = req.body;
    console.log("Deleting address for user", userId, "at index", addressIndex);
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return res.status(400).json({ success: false, message: "Invalid address index" });
    }
    user.addresses.splice(addressIndex, 1);
    await user.save();
    console.log("Address deleted successfully for user", userId);
    res.status(200).json({ success: true, message: "Address deleted successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const user = await usermodel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name, uid } = req.body;

    // Log received data for debugging
    console.log("Google login request received:", { email, name, uid });

    if (!email || !name || !uid) {
      console.log("Missing required fields:", { email: !!email, name: !!name, uid: !!uid });
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    let user = await usermodel.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      // Set isGoogleUser first, then password will not be required
      user = new usermodel({
        name,
        email,
        isGoogleUser: true,
        googleId: uid
      });
      await user.save();
      console.log("New Google user created:", user._id);
    } else {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = uid;
        user.isGoogleUser = true;
        await user.save();
        console.log("Existing user updated with Google ID:", user._id);
      } else {
        console.log("Existing Google user logged in:", user._id);
      }
    }

    // Generate token
    const token = await GenerateWebTokenAndSaveCookie(user._id, res);

    res.status(200).json({ success: true, message: "User logged in with Google successfully", user, token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};
