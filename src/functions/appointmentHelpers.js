import { Appointment, Barbershop } from "../schemas/schema.js";
import { days } from "../utils/utils.js";
import { checkBarbersAvailability } from "./barberHelpers.js";

let businessHours = [];

// Function to bring the barbershop info from the BD
export const getBusinessHours = async () => {
  if (businessHours.length <= 0) {
    try {
      const barberInfo = await Barbershop.findOne({ name: "Barbería Central" })
        .select("businessHours")
        .lean();
      businessHours = barberInfo.businessHours;
    } catch (error) {
      console.error("❌ Error obteniendo horarios:", error);
    }
    return businessHours;
  }
};

// Function to bring the appointments from the BD, use condition when you need to filter them
export const getAppointments = async (condition = {}) => {
  try {
    const app = await Appointment.find(condition).lean();
    return app;
  } catch (error) {
    console.error("❌ Error obteniendo citas:", error);
  }
};

// Function to bring the appointments from the BD, use condition when you need to filter them
export const getFirstAppointment = async (condition = {}) => {
  try {
    const app = await Appointment.findOne(condition).lean();
    return app;
  } catch (error) {
    console.error("❌ Error obteniendo cita:", error);
  }
};

// Function to check if the date is available with an specific barber
export const isAppointmentTaken = async (date, barber) => {
  const appointmentList = await getAppointments();
  if (
    appointmentList.some(
      (appointment) => appointment.date == date && appointment.barber == barber
    )
  ) {
    return {
      success: false,
      message: `La fecha y hora ya están ocupadas con ese barbero. Los barberos disponibles en ese horario son: ${await checkBarbersAvailability(
        date
      )}`,
    };
  }
};

// Function to check if the date for creating an appointment is correct
export const isScheduleOkay = async (date) => {
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
  const businessHours = await getBusinessHours();
  const availableHours =
    businessHours.find((day) => day.day === weekDay)?.hours || [];
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
