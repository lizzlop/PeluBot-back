import OpenAI from "openai";
import readline from "node:readline";
import "dotenv/config";
import { SYSTEM_PROMPT } from "./utils/utils.js";
import {
  createAppointment,
  deleteAppointment,
  confirmAppointment,
  rescheduleAppointment,
} from "./functions/handleAppointments.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Function handler for the LLM
export const functionHandler = {
  createAppointment: (args) => {
    const [name, barber, date, phone, message] = args;
    return createAppointment(name, barber, date, phone, message);
  },
  confirmAppointment: (args) => {
    const [date, phone] = args;
    return confirmAppointment(date, phone);
  },
  rescheduleAppointment: (args) => {
    const [appointmentId, newDate, newBarber] = args;
    return rescheduleAppointment(appointmentId, newDate, newBarber);
  },
  deleteAppointment: (args) => {
    return deleteAppointment(args);
  },
};

// Function to process the LLM response and call functions if necessary
const processLLMResponse = async (response) => {
  try {
    const parsedResponse = JSON.parse(response);

    // Case 1: the model wants to use a function
    if (parsedResponse.to === "system" && parsedResponse.function_call) {
      const { function: functionName, arguments: args } =
        parsedResponse.function_call;

      if (functionHandler[functionName]) {
        console.log(`🔧 Ejecutando función: ${functionName}`, args);

        const result = functionHandler[functionName](args);
        console.log("✅ Resultado función:", result);

        // sends back the result so the model can decide what to answer
        const followUpResponse = await sendtoLLM(
          JSON.stringify({
            to: "system",
            message: `Resultado de ${functionName}: ${JSON.stringify(result)}`,
          })
        );

        console.log("🧠 Respuesta final del modelo:", followUpResponse);
        return followUpResponse;
      } else {
        console.log(`❌ Función no encontrada: ${functionName}`);
        return "Error: función no disponible.";
      }
    }

    // Case 2: the model wants to just answer to te user
    if (parsedResponse.to === "user") {
      return JSON.stringify({
        to: "user",
        message: parsedResponse.message,
      });
    }
    return parsedResponse;
  } catch (error) {
    console.log("⚠️ Error al parsear JSON:", error.message);
    return response;
  }
};

// Function to run the agent in the terminal
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
    console.log("response inicial", response);
    const processedResponse = await processLLMResponse(response);
    console.log("response final", processedResponse);
  }
};

export const runAgent = async (newMessage) => {
  const response = await sendtoLLM(newMessage);
  console.log("response inicial", response);
  const processedResponse = await processLLMResponse(response);
  console.log("response final", processedResponse);
  return processedResponse;
};
