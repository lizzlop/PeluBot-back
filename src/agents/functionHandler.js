import {
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "../functions/handleAppointments.js";

export const functionHandler = {
  createAppointment: (args) => {
    const [name, barber, date, phone, message] = args;
    return createAppointment(name, barber, date, phone, message);
  },
  confirmAppointment: (args) => {
    const [date, phone] = args;
    return confirmAppointment(date, phone);
  },
  rescheduleAppointment: (args) => {
    const [appointmentId, newDate, newBarber] = args;
    return rescheduleAppointment(appointmentId, newDate, newBarber);
  },
  deleteAppointment: (args) => {
    return deleteAppointment(args);
  },
};

export const executeFunction = async (functionName, args) => {
  if (!functionHandler[functionName]) {
    throw new Error(`Función no encontrada: ${functionName}`);
  }

  console.log(`🔧 Ejecutando función: ${functionName}`, args);
  const result = await functionHandler[functionName](args);
  console.log("✅ Resultado función:", result);

  return result;
};
