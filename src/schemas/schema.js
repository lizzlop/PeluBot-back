import mongoose from "mongoose";

export const appointmentSchema = new mongoose.Schema({
  name: String,
  barber: String,
  date: String,
  phone: String,
  message: String,
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);

const barberSchema = new mongoose.Schema({
  name: String,
  barbershopId: Number,
  color: String,
  isActive: Boolean,
  createdAt: Date,
});

export const Barber = mongoose.model("Barber", barberSchema);

const barbershopSchema = new mongoose.Schema({
  name: String,
  businessHours: Array,
});

export const Barbershop = mongoose.model("Barbershop", barbershopSchema);
