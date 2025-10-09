import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mockAppointments from "./mock/mockDates.js";

const typeDefs = `
  type Query {
    getAppointments: [appointment]
    getAppointmentsByBarber(barber: String!): [appointment]
  }

  type Mutation {
    createAppointment(name: String!, barber: String!, date: String!, time: String!): appointment
  }

  type appointment {
    id: ID
    name: String
    barber: String
    date: String
    time: String
  }
`;

//TODO: Implementar las resolvers
const resolvers = {
  Query: {
    getAppointments: () => {
      return mockAppointments;
    },
    getAppointmentsByBarber: (parent, args) => {
      return mockAppointments.filter(appointment => appointment.barber == args.barber);
    },
  },
  Mutation: {
    createAppointment: (parent, args) => {
      const { name, barber, date, time } = args;
      const newAppointment = {
        id: mockAppointments.length + 1,
        name,
        barber,
        date,
        time
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at ${url}`);
