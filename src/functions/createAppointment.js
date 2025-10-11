import mockAppointments from "../mock/mockDates.js";

// Function to create appointments
export const createAppointment = (name, barber, date, phone, message) => {
  const newAppointment = {
    id: mockAppointments.length + 1,
    name,
    barber,
    date,
    phone,
    message,
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
};
