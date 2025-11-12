import mongoose from "mongoose";
import Joi from "joi";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser;
    },
    select: false,
  },
  token: {
    type: String,
    default: ""
  },
  cartData: {
    type: Object,
    default: {},
  },
  addresses: [{
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    email: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" }
  }],
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String, default: "" },
  resetToken: { type: String, default: "" },
  resetTokenExpiry: { type: Date, default: null }
},{minimize:false});

export const validateUser = (userdata) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Name is required",
      "string.min": "Username must be at least 3 characters long",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
  });

  return schema.validate(userdata);
};

const usermodel = mongoose.models.user || mongoose.model("user", UserSchema);
export default usermodel;
