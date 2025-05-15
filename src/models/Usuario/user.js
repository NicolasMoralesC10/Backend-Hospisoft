import { Schema, model, Types } from "mongoose";
const usuarioSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rol: {
      type: Types.ObjectId, // Esto es para la foranea de roles
      ref: "Roles",
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  { collection: "users" }
);
export default model("Usuario", usuarioSchema);
