import { Schema, model } from "mongoose";
const medicamentosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    codigo: {
      type: String,
      required: true
    },
    presentacion: {
      // (Tabletas, jarabe, Inyección)
      type: String,
      required: true
    },
    concentracion: {
      // (500mg, 5 mg/ml)
      type: String,
      required: true
    },
    viaAdminist: {
      // (oral, intravenosa, tópica, etc)
      type: String,
      required: true
    },
    stockDisponible: {
      type: Number,
      required: true
    },
    fechaVencimiento: {
      type: String,
      required: true
    },
    precioCompra: {
      type: Number,
      required: true
    },
    precioVenta: {
      type: Number,
      required: true
    },
    imagen: {
      type: String,
      default: ""
    },
    status: {
      type: Number,
      required: true
    }
  },
  { collection: "medicamentos" }
);
export default model("Medicamentos", medicamentosSchema);
