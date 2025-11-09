import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/database.js";
import { runAgentTerminal } from "./agents/agent.js";
import {
  getAppointments,
  getBusinessHours,
} from "./functions/appointmentHelpers.js";
import {
  createAppointment,
  deleteAppointment,
} from "./functions/handleAppointments.js";

try {
  // Connect database
  await connectDB();

  // Inicialice Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return {
        message: error.message,
        code: error.extensions?.code || "INTERNAL_ERROR",
      };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
  });

  console.log(`🚀 Server ready at ${url}`);

  // await createAppointment(
  //   "Liss",
  //   "Santiago",
  //   "2025-11-15T12:00:00",
  //   "3147614111",
  //   ""
  // );
  //runAgentTerminal();
} catch (error) {
  console.error("Failed to start server:", error);
}
