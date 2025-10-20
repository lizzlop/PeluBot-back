import OpenAI from "openai";
import readline from "node:readline";
import "dotenv/config";
import { SYSTEM_PROMPT } from "./utils/utils.js";
import {
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
      return parsedResponse.message;
    }

    return response;
  } catch (error) {
    console.log("⚠️ Error al parsear JSON:", error.message);
    return response;
  }
};

export const interpret = async () => {
  while (true) {
    const input = await new Promise((resolve) => {
      rl.question("Say something (escribe 'exit' para salir): ", resolve);
    });

    //TODO: Agregar de mejor forma lo de exit
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
