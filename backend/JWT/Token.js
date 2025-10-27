import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import dotenv from "dotenv";
dotenv.config();

export const GenerateWebTokenAndSaveCookie = async (userId, res) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await User.findByIdAndUpdate(userId, { token });

    return token;
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};
