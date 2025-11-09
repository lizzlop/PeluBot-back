import mockAppointments from "../mock/mockDates.js";
import { Appointment } from "../schemas/schema.js";
import {
  getAppointments,
  getFirstAppointment,
  isAppointmentTaken,
  isScheduleOkay,
} from "./appointmentHelpers.js";
import { isBarberOkay } from "./barberHelpers.js";

// Function to create appointments
export const createAppointment = async (name, barber, date, phone, message) => {
  const [barberResult, scheduleResult, appointmentResult] = await Promise.all([
    isBarberOkay(barber),
    isScheduleOkay(date),
    isAppointmentTaken(date, barber),
  ]);
  console.log("checkApp", barberResult, scheduleResult, appointmentResult);
  const error = [barberResult, scheduleResult, appointmentResult].find(
    (result) => result && !result.success
  );

  if (error) return error;

  try {
    const newAppointment = await Appointment.create({
      name: name,
      barber: barber,
      date: date,
      phone: phone,
      message: message,
    });
    return {
      success: true,
      message: "Cita creada con éxito.",
      appointment: newAppointment,
    };
  } catch (error) {
    console.error("❌ Error creando cita:", error);
    return { success: false, error: error.message };
  }
};

// Function to confirm the appointment before deleting it
export const confirmAppointment = async (date, phone) => {
  const appointmentToConfirm = await getFirstAppointment({
    date: date,
    phone: phone,
  });
  if (appointmentToConfirm) {
    return {
      success: true,
      message: `${appointmentToConfirm.name}, tienes una cita con ${appointmentToConfirm.barber} el ${appointmentToConfirm.date}`,
      appointmentId: appointmentToConfirm._id,
    };
  } else {
    return {
      success: false,
      message: `La cita no fue encontrada.`,
    };
  }
};

// Function to reschedule an appointment
export const rescheduleAppointment = (
  appointmentId,
  newDate,
  newBarber = ""
) => {
  const appointmentToReschedule = mockAppointments.find(
    (app) => app.id == appointmentId
  );
  const newAppointment = createAppointment(
    appointmentToReschedule.name,
    newBarber || appointmentToReschedule.barber,
    newDate,
    appointmentToReschedule.phone,
    "Cita re-programada"
  );
  const indexToRemove = mockAppointments.findIndex(
    (appointment) => appointment.id == appointmentId
  );
  if (indexToRemove !== -1) {
    mockAppointments.splice(indexToRemove, 1);
  }
  return {
    success: true,
    message: `La cita fue re-programada exitosamente`,
    appointment: newAppointment.appointment,
  };
};

// Function to delete an appointment
export const deleteAppointment = async (appointmentId) => {
  const result = await Appointment.deleteOne({
    _id: appointmentId,
  });
  if (result.deletedCount == 1) {
    return {
      success: true,
      message: `La cita fue eliminada exitosamente`,
    };
  } else if (result.deletedCount == 0) {
    return {
      success: false,
      message: `La cita no se encontró para ser eliminada`,
    };
  }
};
