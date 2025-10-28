import mockAppointments from "../mock/mockDates.js";
import { barbers, bussinessHours, days } from "../utils/utils.js";

// Function to check which barbers are avaliable in a date
export const checkBarbersAvailability = (targetDate) => {
  return barbers.filter(
    (barber) =>
      !mockAppointments.some(
        (appointment) =>
          appointment.barber == barber.name && appointment.date === targetDate
      )
  );
};

// Function to check if an appointment is available with a barber
const isAppointmentTaken = (date, barber) => {
  console.log(
    "🎉 funcion isAppointmentTaken con date ",
    date,
    "y barbero ",
    barber
  );
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
  const weekDay = days[appointmentDate.getDay()];
  const avaliableHours = bussinessHours[weekDay];
  if (!avaliableHours || avaliableHours.length === 0) {
    return {
      success: false,
      message: `El día seleccionado la barbería no tiene servicio.`,
    };
  }
  const time = appointmentDate.toTimeString().split(" ")[0];
  if (time < avaliableHours[0]) {
    return {
      success: false,
      message: `La hora es antes de la hora de apertura de la barbería: ${avaliableHours[0]}`,
    };
  }
  if (time > avaliableHours.at(-1)) {
    return {
      success: false,
      message: `El último turno disponible es a las: ${avaliableHours.at(-1)}`,
    };
  }
  if (!avaliableHours.includes(time)) {
    return {
      success: false,
      message: `El horario seleccionado no está disponible. Por favor elige una hora entre las permitidas: ${avaliableHours}`,
    };
  }
};

// Function to create appointments
export const createAppointment = (name, barber, date, phone, message) => {
  console.log(
    "🎉 ingresa a createAppointment con: ",
    name,
    barber,
    date,
    phone,
    message
  );
  const checkAppointment =
    isScheduleOkay(date) || isAppointmentTaken(date, barber);
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
  console.log("🎉 mockAppointments 10", mockAppointments[10]);

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
    "Cita reprogramada"
  );
  const indexToRemove = mockAppointments.findIndex(
    (appointment) => appointment.id == appointmentId
  );
  if (indexToRemove !== -1) {
    mockAppointments.splice(indexToRemove, 1);
  }
  console.log("🎉 mockAppointments after reschedule", mockAppointments);
  return {
    success: true,
    message: `La cita fue reprogramada exitosamente`,
    appointment: newAppointment.appointment,
  };
};

// Function to delete an appointment
export const deleteAppointment = (appointmentId) => {
  console.log("🎉 entró en delete");
  const indexToRemove = mockAppointments.findIndex(
    (appointment) => appointment.id == appointmentId
  );
  if (indexToRemove !== -1) {
    mockAppointments.splice(indexToRemove, 1);
  }
  console.log("🎉 mockAppointments after delete", mockAppointments);
  return {
    success: true,
    message: `La cita fue eliminada exitosamente`,
  };
};
