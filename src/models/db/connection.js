import mongoose from "mongoose";
import config from "../config/database.js";

export const cnx = async () => {
  try {
    await mongoose.connect(config.mongoURL);
    console.log("Conexion exitosa");
  } catch {
    console.error(`Hubo un error en la conexion a MongoDB:`);
    process.exit(1); //Termina el proceso Node.js con un código de salida distinto de cero (1), lo que indica que ocurrió un error. Esto evita que la aplicación continúe ejecutándose en un estado inconsistente.
  }
};
