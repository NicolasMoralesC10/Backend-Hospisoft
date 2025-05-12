import { Schema, model, Types } from "mongoose";
const usuarioSchema = new Schema(
  {
    nombreUsuario: {
      type: String,
      required: true
    },
    passwordUser: {
      type: String,
      required: true
    },
    emailUser: {
      type: String,
      required: true
    },
    rol: {
      type: String,/*  Types.ObjectId, */ // Esto es para la foranea de roles
      /* ref: "Roles", */
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
