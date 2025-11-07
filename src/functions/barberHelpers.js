import { Barber } from "../schemas/schema.js";

let barbers = [];

// Function to bring the barbers from the BD
export const getBarbers = async () => {
  if (barbers.length <= 0) {
    console.log("🎉 Llama a BD");
    try {
      barbers = await Barber.find({ isActive: true })
        .select("id name color")
        .lean();
    } catch (error) {
      console.error("❌ Error obteniendo barberos:", error);
    }
    return barbers;
  }
};

// Function to check if the input barber is one of the barbers in the barbershop
export const isBarberOkay = (selectedBarber) => {
  if (getBarbers().includes(selectedBarber)) {
    return {
      success: false,
      message: `El barbero seleccionado no existe, los barberos disponibles son: ${barbers.map(
        (barber) => barber.name
      )}`,
    };
  }
};

// Function to check which barbers are available in a date
export const checkBarbersAvailability = (targetDate) => {
  const availableBarbers = getBarbers().filter(
    (barber) =>
      !mockAppointments.some(
        (appointment) =>
          appointment.barber == barber.name && appointment.date === targetDate
      )
  );
  return availableBarbers.map((barber) => barber.name).join(", ");
};
