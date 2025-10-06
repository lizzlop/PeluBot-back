import express from "express";
import router from "./routes.js";

const app = express();
const PORT = 3000;

app.use("/appointments", router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});