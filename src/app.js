import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mockAppointments from "./mock/mockDates.js";
import { runAgent, runAgentTerminal } from "./agent.js";
import {
  createAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "./functions/handleAppointments.js";
import { barbers, businessHours } from "./utils/utils.js";

const typeDefs = `
  type Query {
    getAppointments: [appointment]
    getBarbers: [barber]
    getBusinessHours: [businessHours]
  }

  type Mutation {
    createAppointment(name: String!, barber: String!, date: String!, phone: String!, message: String): createAppointmentResponse!
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

  type barber {
    id: ID!
    name: String!
    color: String
  }

  type createAppointmentResponse {
    success: Boolean!
    message: String!
  }

  type businessHours {
    id: ID!
    day: String!
    hours: [String!]!
  }
`;

const resolvers = {
  Query: {
    getAppointments: () => {
      return mockAppointments;
    },
    getBarbers: () => {
      return barbers;
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

const server = new ApolloServer({ typeDefs, resolvers });

await startStandaloneServer(server, {
  listen: { port: 4000 },
});

runAgentTerminal();
