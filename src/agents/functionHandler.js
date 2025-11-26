import { getBarbers } from "../functions/barberHelpers.js";
import {
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "../functions/handleAppointments.js";

export const functionHandler = {
  getBarbers: async (args) => {
    const barbers = await getBarbers();
    return {
      success: true,
      data: barbers,
      message: `Barberos disponibles: ${barbers.map((b) => b.name).join(", ")}`,
    };
  },
  createAppointment: async (args) => {
    const [name, barber, date, phone, message] = args;
    return await createAppointment(name, barber, date, phone, message);
  },
  confirmAppointment: async (args) => {
    const [date, phone] = args;
    return await confirmAppointment(date, phone);
  },
  rescheduleAppointment: async (args) => {
    const [appointmentId, newDate, newBarber] = args;
    return await rescheduleAppointment(appointmentId, newDate, newBarber);
  },
  deleteAppointment: async (args) => {
    return await deleteAppointment(args);
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
