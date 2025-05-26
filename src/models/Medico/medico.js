import { Schema, model, Types } from "mongoose";

const medicoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true, // Limpia espacios en blanco al inicio/final
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
      trim: true, // Limpia espacios en blanco al inicio/final
    },
    idUsuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true, // Búsquedas mas rapidas
    },
    status: {
      type: Number,
      required: true,
      default: 1, // 1 = activo, 0 = inactivo
      enum: [0, 1], // Solo permite estos valores
    },
  },
  {
    collection: "medicos",
    timestamps: true, // Opcional: agrega createdAt y updatedAt
  }
);

// Índices condicionales únicos (solo aplican cuando status > 0)
medicoSchema.index(
  { documento: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $gt: 0 } },
  }
);

medicoSchema.index(
  { telefono: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $gt: 0 } },
  }
);

export default model("Medicos", medicoSchema);
