import { Schema, model } from "mongoose";
const medicamentosSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    codigo: {
      type: String,
      required: true,
    },
    presentacion: {
      // (Tabletas, jarabe, Inyección)
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    concentracion: {
      // (500mg, 5 mg/ml)
      type: String,
      required: true,
    },
    formaFarmaceutica: {
      // (oral, solucion oral, pomada, etc.)
      type: String,
      required: true,
    },
    viaAdminist: {
      // (oral, intravenosa, tópica, etc)

      type: String,
      required: true,
    },
    uniEnvase: {
      // 10 tabletas, 1 frasco de 100 mL)
      type: String,
      required: true,
    },
    uniMedida: {
      // (tabletas, frascos, ampollas)
      type: String,
      required: true,
    },
    stockDisponible: {
      type: Number,
      required: true,
    },
    fechaVencimiento: {
      type: Date,
      required: true,
    },
    precioCompra: {
      type: Number,
      required: true,
    },
    precioVenta: {
      type: Number,
      required: true,
    },
    imgen: {
      // (tabletas, frascos, ampollas)
      type: String,
      default: "",
    },

    status: {
      type: Number,
      required: true,
    },
  },
  { collection: "medicamentos" }
);
export default model("Medicamentos", medicamentosSchema);
