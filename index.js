import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errors } from "celebrate";
import { cnx } from "./src/models/db/connection.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { authenticate, verifyRole } from "./src/middleware/auth.js";

import auth from "./src/routes/auth.js";
import medico from "./src/routes/medico.js";
import patient from "./src/routes/patient.js";
import cita from "./src/routes/cita.js";
import medicamentos from "./src/routes/medicamentos.js";
import user from "./src/routes/user.js";
import roles from "./src/routes/roles.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// rutas
app.use("/api", auth);
app.use("/api", authenticate, verifyRole(["superuser", "admin"]), medico);
app.use("/api", authenticate, verifyRole(["superuser", "admin"]), patient);
app.use("/api", authenticate, verifyRole(["superuser", "admin", "secretaria", "medico", "paciente"]), cita);
app.use("/api", authenticate, verifyRole(["superuser", "admin", "medico", "dispensario"]), medicamentos);
app.use("/api", authenticate, verifyRole(["superuser", "admin", "secretaria"]), user);
app.use("/api", authenticate, verifyRole(["superuser", "admin", "secretaria"]), roles);

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
