import { Schema, model, Types } from "mongoose";

const citaSchema = new Schema(
  {
    fecha: {
      type: Date,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    idPaciente: {
      type: Types.ObjectId,
      ref: "Patients",
      required: true,
      index: true, // Mejora rendimiento en populate()
    },
    idMedico: {
      type: Types.ObjectId,
      ref: "Medicos",
      required: true,
      index: true, // Mejora rendimiento en populate()
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1, 2], // Valores permitidos: 0 = inactivo, 1 = activo
    },
  },
  {
    collection: "citas",
    timestamps: true, // Crea campos: created_at y updated_at
  }
);

export default model("Cita", citaSchema);
