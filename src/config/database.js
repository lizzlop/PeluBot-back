import { mongoose } from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/peluBot";
    await mongoose.connect(mongoUri);
    console.log("🎯 MongoDB Local CONECTADO - Base de datos: peluBot");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("Error de MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB desconectado");
});
