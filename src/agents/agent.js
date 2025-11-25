import "dotenv/config";
import readline from "node:readline";
import { sanitizeJson, SYSTEM_PROMPT } from "../utils/utils.js";
import { createOpenAIClient } from "./openIAClient.js";
import { executeFunction } from "./functionHandler.js";

const client = createOpenAIClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Array for store the messages and responses
const messages = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];

const sendtoLLM = async (content) => {
  messages.push({
    role: content.to === "system" ? "system" : "user",
    content,
    max_tokens: 1000,
  });
  try {
    const response = await client.chat.completions.create({
      messages,
      model: "gpt-4o",
    });
    messages.push(response.choices[0].message);
    return response.choices[0].message.content;
  } catch (error) {
    console.log("❌ error al enviar a LLM", error);
    return error.message;
  }
};

// Function to process the LLM response and call functions if necessary
const processLLMResponse = async (response) => {
  try {
    let currentResponse = response;
    let safetyCounter = 0;
    const MAX_FOLLOW_UPS = 10;

    while (safetyCounter < MAX_FOLLOW_UPS) {
      safetyCounter += 1;
      const parsedResponse = JSON.parse(sanitizeJson(currentResponse));

      // Case 1: The model wants to execute a function call
      if (parsedResponse.to === "system" && parsedResponse.function_call) {
        const { function: functionName, arguments: args } =
          parsedResponse.function_call;

        const result = await executeFunction(functionName, args);

        // Send the result back to the model
        currentResponse = await sendtoLLM(
          JSON.stringify({
            to: "system",
            message: `Resultado de ${functionName}: ${JSON.stringify(result)}`,
          })
        );
        continue;
      }

      // Case 2: The model wants to reply to the user
      if (parsedResponse.to === "user") {
        console.log("🎉 user");
        return JSON.stringify({
          to: "user",
          message: parsedResponse.message,
        });
      }

      console.error(
        "⚠️ Respuesta sin destino manejable, se detiene el ciclo:",
        parsedResponse
      );
      return currentResponse;
    }

    console.warn("⚠️ Se alcanzó el límite de follow-ups permitidos");
    return currentResponse;
  } catch (error) {
    console.error("⚠️ Error al procesar respuesta:", error.message);
  }
};

// Function to run the agent in the terminal for test mode
export const runAgentTerminal = async () => {
  while (true) {
    const input = await new Promise((resolve) => {
      rl.question("Say something (escribe 'exit' para salir): ", resolve);
    });

    if (input.toLowerCase() === "exit") {
      rl.close();
      break;
    }

    const response = await sendtoLLM(input);
    console.log("🤖 response inicial", response);
    const processedResponse = await processLLMResponse(response);
    console.log("🤖 response final", processedResponse);
  }
};

//Function to run agent from the frontEnd
export const runAgent = async (newMessage) => {
  const response = await sendtoLLM(newMessage);
  console.log("response inicial", response);
  const processedResponse = await processLLMResponse(response);
  console.log("response final", processedResponse);
  return processedResponse;
};
