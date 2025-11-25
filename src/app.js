import { connectDB } from "./config/database.js";
import { runAgentTerminal } from "./agents/agent.js";
import { initializeApolloServer } from "./config/apollo.js";

try {
  await initializeApolloServer();
  await connectDB();

  runAgentTerminal();
} catch (error) {
  console.error("Failed to start server:", error);
}
