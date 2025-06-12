import { Schema, model } from "mongoose";

const rolSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
    },
  },
  { collection: "roles" }
);

export default model("Roles", rolSchema);
