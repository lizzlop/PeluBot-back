import { Barber } from "../schemas/schema.js";
import { getAppointments } from "./appointmentHelpers.js";

//TODO: Mirar como disminuir los llamados a la BD

// Function to bring the barbers from the BD
export const getBarbers = async () => {
  try {
    const barbers = await Barber.find({ isActive: true })
      .select("id name color")
      .lean();
    return barbers;
  } catch (error) {
    console.error("❌ Error obteniendo barberos:", error);
  }
};

// Function to check if the input barber is one of the barbers in the barbershop
export const isBarberOkay = async (selectedBarber) => {
  const barbers = await getBarbers();
  if (!barbers.some((barber) => barber.name === selectedBarber)) {
    return {
      success: false,
      message: `El barbero seleccionado no existe, los barberos disponibles son: ${barbers.map(
        (barber) => barber.name
      )}`,
    };
  }
};

// Function to check which barbers are available in a date
export const checkBarbersAvailability = async (targetDate) => {
  const barbers = await getBarbers();
  const appointments = await getAppointments();

  const availableBarbers = barbers.filter(
    (barber) =>
      !appointments.some(
        (appointment) =>
          appointment.barber === barber.name && appointment.date === targetDate
      )
  );

  return availableBarbers.map((barber) => barber.name).join(", ");
};
