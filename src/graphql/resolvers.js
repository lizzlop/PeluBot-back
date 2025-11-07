import {
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "../functions/handleAppointments.js";
import { businessHours } from "../utils/utils.js";
import { runAgent } from "../agents/agent.js";
import mockAppointments from "../mock/mockDates.js";
import { getBarbers } from "../functions/barberHelpers.js";

export const resolvers = {
  Query: {
    getAppointments: () => {
      return mockAppointments;
    },
    getBarbers: () => {
      return getBarbers();
    },
    getBusinessHours: () => {
      return businessHours;
    },
  },
  Mutation: {
    createAppointment: (_, args) => {
      const { name, barber, date, phone, message } = args;
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
