import { Schema, model } from "mongoose";

const rolSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
  },
  { collection: "roles" }
);

export default model("Roles", rolSchema);
