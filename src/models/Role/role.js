import { Schema, model } from "mongoose";

const rolSchema = new Schema(
  {
    nombreRol: {
      type: String,
      required: true,
    },
    descripcionRol: {
      type: String,
      required: true,
    },
  },
  { collection: "roles" }
);

export default model("Roles", rolSchema);
