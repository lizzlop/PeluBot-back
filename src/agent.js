import OpenAI from "openai";
import readline from "node:readline";
import "dotenv/config";
import { SYSTEM_PROMPT } from "./utils/utils.js";
import {
  checkAppointmentAvailability,
  createAppointment,
  deleteAppointment,
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
    role: "user",
    content,
  });
  const response = await client.chat.completions.create({
    messages,
    model: "gpt-4o",
  });
  messages.push(response.choices[0].message);
  return response.choices[0].message.content;
};

// Function handler for the LLM
export const functionHandler = {
  createAppointment: (args) => {
    const [name, barber, date, phone, message] = args;
    return createAppointment(name, barber, date, phone, message);
  },
  checkAppointmentAvailability: (args) => {
    const [date, barber] = args;
    return checkAppointmentAvailability(date, barber);
  },
  checkBarbersAvailability: (args) => {
    const [date] = args;
    return createAppointment(date);
  },
  rescheduleAppointment: (args) => {
    const [newBarber, oldDate, newDate, phone] = args;
    return rescheduleAppointment(newBarber, oldDate, newDate, phone);
  },
  deleteAppointment: (args) => {
    const [date, phone] = args;
    return deleteAppointment(date, phone);
  },
};

// Function to process the LLM response and call functions if necessary
const processLLMResponse = async (response) => {
  try {
    const parsedResponse = JSON.parse(response);

    if (parsedResponse.to === "system" && parsedResponse.function_call) {
      const { function: functionName, arguments: args } =
        parsedResponse.function_call;

      if (functionHandler[functionName]) {
        console.log(
          `🔧 Ejecutando función: ${functionName} con argumentos:`,
          args
        );
        const result = functionHandler[functionName](args);
        console.log("✅ Resultado:", result);
        return `Función ${functionName} ejecutada exitosamente. Resultado: ${JSON.stringify(
          result
        )}`;
      } else {
        console.log(`❌ Función no encontrada: ${functionName}`);
        return `Error: La función ${functionName} no está disponible.`;
      }
    } else if (parsedResponse.to === "user") {
      return parsedResponse.message;
    } else {
      return response;
    }
  } catch (error) {
    console.log(
      "⚠️ Error al parsear respuesta JSON, devolviendo respuesta directa:",
      error.message
    );
    return response; // Si no es JSON válido, devolver la respuesta tal como está
  }
};

export const interpret = async () => {
  let running = true;
  while (running) {
    const input = await new Promise((resolve) => {
      rl.question("Say something (escribe 'exit' para salir): ", resolve);
    });

    if (input.toLowerCase() === "exit") {
      running = false;
      rl.close();
      break;
    }

    const response = await sendtoLLM(input);
    console.log("response inicial", response);
    const processedResponse = await processLLMResponse(response);
    console.log("response final", processedResponse);
  }
};
