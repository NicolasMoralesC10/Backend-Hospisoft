import { Schema, model, Types } from "mongoose"; // Importa Types aquí

const medicoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    documento: {
      type: Number,
      required: true,
    },
    telefono: {
      type: Number,
      required: true,
    },
    especialidad: {
      type: String,
      required: true,
    },
    idUsuario: {
      type: Types.ObjectId, // Esto es para la foránea de Usuarios
      ref: "Usuario",
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  { collection: "medicos" }
);

export default model("Medicos", medicoSchema);
