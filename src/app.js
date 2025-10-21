import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mockAppointments from "./mock/mockDates.js";
import { interpret } from "./agent.js";
import {
  createAppointment,
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
      const { appointmentToReschedule, newDate, barber } = args;
      return rescheduleAppointment(appointmentToReschedule, newDate, barber);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

await startStandaloneServer(server, {
  listen: { port: 4000 },
});

interpret();
