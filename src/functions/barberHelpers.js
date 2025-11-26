import { Barber } from "../schemas/schema.js";
import { getAppointments } from "./appointmentHelpers.js";
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

// Function to inspect the barbers name in case is random
export const inspectBarber = async (barber, date) => {
  if (barber == "No tengo preferencia" || barber == "random") {
    const availableBarbers = await checkBarbersAvailability(date);
    return availableBarbers[
      Math.trunc(Math.random() * availableBarbers.length)
    ];
  } else {
    return barber;
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
  const [barbers, appointments] = await Promise.all([
    getBarbers(),
    getAppointments(),
  ]);

  const availableBarbers = barbers.filter(
    (barber) =>
      !appointments.some(
        (appointment) =>
          appointment.barber === barber.name && appointment.date === targetDate
      )
  );

  return availableBarbers.map((barber) => barber.name);
};
