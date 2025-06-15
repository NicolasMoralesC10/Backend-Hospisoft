import { Schema, Types, model } from "mongoose";

const medicamentoSchema = new Schema({
  nombre: { type: String, required: true },
  dosis: { type: String, required: true },
  frecuencia: { type: String, required: true },
  duracion: { type: String, required: true },
  codigo: { type: String, required: true },
  _id: { type: String, required: true },
});

const diagnosticoSchema = new Schema(
  {
    medicalId: {
      type: Types.ObjectId,
      ref: "Medical",
      required: true,
    },
    patientId: {
      type: Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    fecha: { type: String, required: true },
    motivoConsulta: { type: String, required: true },
    diagPrincipal: { type: String, required: true },
    diagSecundario: [{ type: String }],
    historia: { type: String },
    examenFisico: [
      {
        presionArterial: { type: String, required: true },
        frecuenciaCardiaca: { type: String, required: true },
        frecuenciaRespiratoria: { type: String, required: true },
        temperatura: { type: String, required: true },
        observaciones: { type: String, required: true },
      },
    ],
    evoClinica: { type: String },
    medicamentos: [medicamentoSchema],
    status: { type: String, required: true },
    // Campo agregado para prioridad
    prioridad: { 
      type: String, 
      required: true, 
      enum: ['Alta', 'Media', 'Baja'],
      default: 'Media'
    },
  },
  { collection: "diagnostico" }
);

export default model("Diagnostico", diagnosticoSchema);