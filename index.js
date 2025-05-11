import express from "express";
import cors from "cors";
import { errors } from "celebrate";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { cnx } from "./src/models/db/connection.js";
import medicamentos from "./src/routes/medicamentos.js";
import patient from "./src/routes/patient.js";
import usuarioRuta from "./src/routes/user.js";
import rolesRuta from "./src/routes/roles.js";

const app = express();
app.use(express.json());
app.use(cors());

// rutas
app.use("/api", medicamentos);
app.use("/api", patient);
app.use("/api", usuarioRuta);
app.use("/api", rolesRuta);

app.use(errors());
app.use(errorHandler);

const initServe = async () => {
  await cnx();
  const puerto = process.env.PORT || 3000;
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
  });
};

initServe().catch(console.error);
