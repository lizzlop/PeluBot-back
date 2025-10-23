import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mockAppointments from "./mock/mockDates.js";
import { runAgent } from "./agent.js";
import {
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "./functions/handleAppointments.js";

const typeDefs = `
  type Query {
    getAppointments: [appointment]
    getAppointmentsByBarber(barber: String!): [appointment]
  }

  type Mutation {
    createAppointment(name: String!, barber: String!, date: String!): appointment
    rescheduleAppointment(appointmentId: ID!, newDate: String!, barber: String): appointment
    deleteAppointment(appointmentId: ID!): appointment
    runAgent(newMessage: String!): String!
  }

  type appointment {
    id: ID
    name: String
    barber: String
    date: String
    phone: Int
    message: String
  }
`;

//TODO: Implementar las resolvers
const resolvers = {
  Query: {
    getAppointments: () => {
      return mockAppointments;
    },
    getAppointmentsByBarber: (parent, args) => {
      return mockAppointments.filter(
        (appointment) => appointment.barber == args.barber
      );
    },
  },
  Mutation: {
    createAppointment: (parent, args) => {
      const { name, barber, date, time } = args;
      return createAppointment(name, barber, date, time);
    },
    rescheduleAppointment: (parent, args) => {
      const { appointmentId, newDate, barber } = args;
      return rescheduleAppointment(appointmentId, newDate, barber);
    },
    deleteAppointment: (parent, args) => {
      const { appointmentId } = args;
      return deleteAppointment(appointmentId);
    },
    runAgent: (args) => {
      const { newMessage } = args;
      return runAgent(newMessage);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

await startStandaloneServer(server, {
  listen: { port: 4000 },
});
