import { Schema, model, Types } from "mongoose";

const usuarioSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Normaliza emails a minúsculas
    },
    rol: {
      type: Types.ObjectId,
      ref: "Roles",
      required: true,
      index: true, // Mejora rendimiento en populate()
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1], // Valores permitidos: 0 = inactivo, 1 = activo
    },
  },
  {
    collection: "users",
    timestamps: true, // Crea campos: created_at y updated_at
  }
);

// Índice condicionales únicos (solo aplican cuando status > 0)
usuarioSchema.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $gt: 0 } },
  }
);

usuarioSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $gt: 0 } },
  }
);

export default model("Usuario", usuarioSchema);
