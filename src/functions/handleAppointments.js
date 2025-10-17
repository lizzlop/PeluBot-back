import mockAppointments from "../mock/mockDates.js";
import { barbers } from "../utils/utils.js";

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

// Function to check if an appointment is available with a barber
export const checkAppointmentAvailability = (date, barber) => {
  return mockAppointments.some(
    (appointment) => appointment.date == date && appointment.barber == barber
  );
};

// Function to check which barbers are avaliable in a date
export const checkBarbersAvailability = (targetDate) => {
  return barbers.filter(
    (barber) =>
      !mockAppointments.some(
        (appointment) =>
          appointment.barber == barber && appointment.date === targetDate
      )
  );
};

// Function to reschedule an appointment
export const rescheduleAppointment = (newBarber, oldDate, newDate, phone) => {
  const appointmentToReschedule = mockAppointments.find(
    (appointment) => appointment.date == oldDate && appointment.phone == phone
  );
  if (appointmentToReschedule) {
    createAppointment(
      appointmentToReschedule.name,
      newBarber ? newBarber : appointmentToReschedule.barber,
      newDate,
      appointmentToReschedule.phone,
      "Cita reprogramada"
    );
    mockAppointments = mockAppointments.filter(
      (appointment) => appointment.id != appointmentToReschedule.id
    );
  } else {
    throw new Error("the appointment is not found");
  }

  console.log("🎉 mockAppointments after delete", mockAppointments);
  return true;
};

// Function to delete an appointment
export const deleteAppointment = (date, phone) => {
  const appointmentToDelete = mockAppointments.find(
    (appointment) => appointment.date == date && appointment.phone == phone
  );
  if (appointmentToDelete) {
    mockAppointments = mockAppointments.filter(
      (appointment) => appointment.id != appointmentToDelete.id
    );
  }
  console.log("🎉 mockAppointments after delete", mockAppointments);
  return true;
};
