import {
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "../functions/handleAppointments.js";
import { runAgent } from "../agents/agent.js";
import { getBarbers } from "../functions/barberHelpers.js";
import {
  getAppointments,
  getBusinessHours,
} from "../functions/appointmentHelpers.js";
import { Barber } from "../schemas/schema.js";

export const resolvers = {
  Query: {
    getAppointments: () => {
      return getAppointments();
    },
    getBarbers: () => {
      return getBarbers();
    },
    getBusinessHours: () => {
      return getBusinessHours();
    },
  },
  Appointment: {
    barberDetails: async (appointment) => {
      return await Barber.findOne({ name: appointment.barber });
    },
  },
  Mutation: {
    createAppointment: (_, args) => {
      const { name, barber, date, phone, message } = args.input;
      return createAppointment(name, barber, date, phone, message);
    },
    rescheduleAppointment: (_, args) => {
      const { appointmentId, newDate, barber } = args;
      return rescheduleAppointment(appointmentId, newDate, barber);
    },
    deleteAppointment: (_, args) => {
      const { appointmentId } = args;
      return deleteAppointment(appointmentId);
    },
    runAgent: (_, args) => {
      const { newMessage } = args;
      return runAgent(newMessage);
    },
  },
};
