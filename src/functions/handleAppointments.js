import { Appointment } from "../schemas/schema.js";
import {
  getFirstAppointment,
  isAppointmentTaken,
  isScheduleOkay,
} from "./appointmentHelpers.js";
import { inspectBarber, isBarberOkay } from "./barberHelpers.js";

// Function to create appointments
export const createAppointment = async (name, barber, date, phone, message) => {
  const inspectedBarber = await inspectBarber(barber, date);
  const [barberResult, scheduleResult, appointmentResult] = await Promise.all([
    isBarberOkay(inspectedBarber),
    isScheduleOkay(date),
    isAppointmentTaken(date, inspectedBarber),
  ]);
  console.log("checkApp", barberResult, scheduleResult, appointmentResult);

  if (barberResult || scheduleResult || appointmentResult) {
    const error = [barberResult, scheduleResult, appointmentResult].find(
      (result) => result && !result.success
    );
    if (error) return error;
  }

  try {
    const newAppointment = await Appointment.create({
      name: name,
      barber: inspectedBarber,
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

// Function to reschedule an appointment
export const rescheduleAppointment = async (
  appointmentId,
  newDate,
  newBarber = ""
) => {
  let appointmentToReschedule;
  let newAppointment;

  try {
    appointmentToReschedule = await getFirstAppointment({
      _id: appointmentId,
    });

    if (!appointmentToReschedule) {
      return {
        success: false,
        message: "No se encontró la cita especificada",
      };
    }

    const deleteResult = await deleteAppointment(appointmentId);
    if (!deleteResult.success) {
      return deleteResult;
    }
    newAppointment = await createAppointment(
      appointmentToReschedule.name,
      newBarber || appointmentToReschedule.barber,
      newDate,
      appointmentToReschedule.phone,
      "Cita re-programada"
    );

    if (!newAppointment.success) {
      return newAppointment;
    }
    return {
      success: true,
      message: "La cita fue re-programada exitosamente",
      appointment: newAppointment.appointment,
    };
  } catch (error) {
    console.error("❌ Error creando cita:", error);
  }
};
