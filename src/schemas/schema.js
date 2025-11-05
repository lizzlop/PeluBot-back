import mongoose from "mongoose";

export const appointmentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  barber: String,
  date: String,
  phone: Number,
  message: String,
});
