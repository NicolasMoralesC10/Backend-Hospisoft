import { Schema, model, Types } from "mongoose";
const usuarioSchema = new Schema(
  {
    nombreUsuario: {
      type: String,
      unique: true,
      required: true
    },
    passwordUser: {
      type: String,
      required: true
    },
    emailUser: {
      type: String,
      unique: true,
      required: true
    },
    rol: {
      type: Types.ObjectId, // Esto es para la foranea de roles
      ref: "Roles",
      required: false
    },
    status: {
      type: Number,
      required: true
    }
  },
  { collection: "users" }
);
export default model("Usuario", usuarioSchema);
