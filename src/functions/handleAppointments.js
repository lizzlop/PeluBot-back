import mockAppointments from "../mock/mockDates.js";
import { businessHours, days } from "../utils/utils.js";
import { checkBarbersAvailability, isBarberOkay } from "./barberHelpers.js";

// Function to check if an appointment is available with a barber
const isAppointmentTaken = (date, barber) => {
  if (
    mockAppointments.some(
      (appointment) => appointment.date == date && appointment.barber == barber
    )
  ) {
    return {
      success: false,
      message: `La fecha y hora ya están ocupadas con ese barbero. Los barberos disponibles en ese horario son: ${checkBarbersAvailability(
        date
      )}`,
    };
  }
};

// Function to check if the date for creating an appointment is correct
const isScheduleOkay = (date) => {
  const actualDate = new Date();
  const appointmentDate = new Date(date);
  if (appointmentDate < actualDate) {
    return {
      success: false,
      message: "La fecha y hora son anteriores a la fecha actual",
    };
  }
  if (appointmentDate > actualDate.setDate(actualDate.getDate() + 7)) {
    return {
      success: false,
      message:
        "Solo se pueden agendar citas hasta 7 días después de la fecha actual",
    };
  }
  const weekDay = days[appointmentDate.getDay()];
  const availableHours =
    businessHours.find((day) => day.day === weekDay)?.hours || [];
  console.log("🎉 businessHours", businessHours);
  console.log("🎉 availableHours", availableHours);
  if (!availableHours || availableHours.length === 0) {
    return {
      success: false,
      message: `El día seleccionado la barbería no tiene servicio.`,
    };
  }
  const time = appointmentDate.toTimeString().split(" ")[0];
  if (time < availableHours[0]) {
    return {
      success: false,
      message: `La hora es antes de la hora de apertura de la barbería: ${availableHours[0]}`,
    };
  }
  if (time > availableHours.at(-1)) {
    return {
      success: false,
      message: `El último turno disponible es a las: ${availableHours.at(-1)}`,
    };
  }
  if (!availableHours.includes(time)) {
    return {
      success: false,
      message: `El horario seleccionado no está disponible. Por favor elige una hora entre las permitidas: ${availableHours}`,
    };
  }
};

// Function to create appointments
export const createAppointment = (name, barber, date, phone, message) => {
  const checkAppointment =
    isBarberOkay(barber) ||
    isScheduleOkay(date) ||
    isAppointmentTaken(date, barber);
  console.log("checkApp", checkAppointment);
  if (checkAppointment) return checkAppointment;

  const newAppointment = {
    id: mockAppointments.length + 1,
    name,
    barber,
    date,
    phone,
    message,
  };
  mockAppointments.push(newAppointment);

  return {
    success: true,
    message: "Cita creada con éxito.",
    appointment: newAppointment,
  };
};

// Function to confirm the appointment before deleting it
export const confirmAppointment = (date, phone) => {
  const appointmentToConfirm = mockAppointments.find(
    (appointment) => appointment.date == date && appointment.phone == phone
  );
  if (appointmentToConfirm) {
    return {
      success: true,
      message: `${appointmentToConfirm.name}, tienes una cita con ${appointmentToConfirm.barber} el ${appointmentToConfirm.date}`,
      appointmentId: appointmentToConfirm.id,
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
export const deleteAppointment = (appointmentId) => {
  const indexToRemove = mockAppointments.findIndex(
    (appointment) => appointment.id == appointmentId
  );
  if (indexToRemove !== -1) {
    mockAppointments.splice(indexToRemove, 1);
  }
  return {
    success: true,
    message: `La cita fue eliminada exitosamente`,
  };
};
