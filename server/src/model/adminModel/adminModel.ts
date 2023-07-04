import mongoose, { Types } from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validator: [validator.isEmail, "Invalid Email"],
  },
  password: {
    type: String,
  },
});

export type typeOfAdminSchema = typeof adminModel;

export const adminModel = mongoose.model("admin", adminSchema);
