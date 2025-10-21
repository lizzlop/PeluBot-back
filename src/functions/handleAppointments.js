import mockAppointments from "../mock/mockDates.js";
import { barbers, bussinessHours } from "../utils/utils.js";

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
//TODO: Agregar validación de domingos
const isScheduleOkay = (date) => {
  const actualDate = new Date();
  const appointmentDate = new Date(date);
  if (appointmentDate < actualDate) {
    return {
      success: false,
      message: "La fecha y hora son anteriores a la fecha actual",
    };
  }
  const time = appointmentDate.toTimeString().split(" ")[0];
  if (time < bussinessHours[0]) {
    return {
      success: false,
      message: `La hora es antes de la hora de apertura de la barbería: ${bussinessHours[0]}`,
    };
  }
  if (time < bussinessHours[bussinessHours.at(-1)]) {
    return {
      success: false,
      message: `El último turno disponible es a las: ${
        bussinessHours[bussinessHours.at(-1)]
      }`,
    };
  }
  if (!bussinessHours.includes(time)) {
    return {
      success: false,
      message: `El horario seleccionado no está disponible. Por favor elige una hora entre las permitidas: ${bussinessHours}`,
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

// Function to reschedule an appointment
export const rescheduleAppointment = (newBarber, oldDate, newDate, phone) => {
  const appointmentToReschedule = mockAppointments.find(
    (appointment) => appointment.date == oldDate && appointment.phone == phone
  );
  if (appointmentToReschedule) {
    createAppointment(
      appointmentToReschedule.name,
      newBarber || appointmentToReschedule.barber,
      newDate,
      appointmentToReschedule.phone,
      "Cita reprogramada"
    );
    const indexToRemove = mockAppointments.findIndex(
      (appointment) => appointment.id == appointmentToReschedule.id
    );
    if (indexToRemove !== -1) {
      mockAppointments.splice(indexToRemove, 1);
    }
  } else {
    return {
      success: false,
      message: `La cita que intentas reprogramar no fue encontrada.`,
    };
  }
  console.log("🎉 mockAppointments after delete", mockAppointments);
  return true;
};

// Function to confirm the appointment before deleting it
export const requestAppointmentDeletion = (date, phone) => {
  const appointmentToDelete = mockAppointments.find(
    (appointment) => appointment.date == date && appointment.phone == phone
  );
  if (appointmentToDelete) {
    return {
      success: true,
      message: `${appointmentToDelete.name}, tienes una cita con ${appointmentToDelete.barber} el ${appointmentToDelete.date}. ¿Deseas eliminarla?`,
      appointment: appointmentToDelete,
    };
  } else {
    return {
      success: false,
      message: `La cita que intentas eliminar no fue encontrada.`,
    };
  }
};

// Function to delete an appointment
export const deleteAppointment = (appointmentToDelete) => {
  console.log("🎉 entró en delete");
  const indexToRemove = mockAppointments.findIndex(
    (appointment) => appointment.id == appointmentToDelete.id
  );
  if (indexToRemove !== -1) {
    mockAppointments.splice(indexToRemove, 1);
  }
  console.log("🎉 mockAppointments after delete", mockAppointments);
  return {
    success: true,
    message: `La cita fue eliminada exitosamente`,
    appointment: appointmentToDelete,
  };
};
