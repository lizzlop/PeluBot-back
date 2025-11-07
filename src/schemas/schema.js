import mongoose from "mongoose";

export const appointmentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  barber: String,
  date: String,
  phone: Number,
  message: String,
});

const barberSchema = new mongoose.Schema({
  id: Number,
  name: String,
  barbershopId: Number,
  color: String,
  isActive: Boolean,
  createdAt: Date,
});

export const Barber = mongoose.model("Barber", barberSchema);
