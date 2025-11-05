import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { runAgentTerminal } from "./agent.js";

import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/database.js";

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

  //runAgentTerminal();
} catch (error) {
  console.error("Failed to start server:", error);
}
