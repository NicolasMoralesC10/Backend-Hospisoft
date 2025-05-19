import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { getAll, add } from "../controllers/Cita/cita.js";

const router = express.Router();

// Ruta para obtener todas las citas activas
router.get("/cita/list", async (req, res) => {
  try {
    const resultado = await getAll();
    if (resultado.estado) {
      res.status(200).json(resultado.data);
    } else {
      res.status(500).json({ message: resultado.mensaje });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear una nueva cita con validación Celebrate
router.post(
  "/cita/create",
  celebrate({
    [Segments.BODY]: Joi.object({
      fecha: Joi.date().iso().required().messages({
        "date.base": "La fecha debe ser una fecha válida",
        "date.isoDate": "La fecha debe estar en formato ISO 8601",
        "any.required": "La fecha es obligatoria",
      }),
      descripcion: Joi.string().trim().min(3).required().messages({
        "string.base": "La descripción debe ser un texto",
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 3 caracteres",
        "any.required": "La descripción es obligatoria",
      }),
      idPaciente: Joi.string().hex().length(24).required().messages({
        "string.length": "El idPaciente debe tener 24 caracteres hexadecimales",
        "any.required": "El idPaciente es obligatorio",
      }),
      idMedico: Joi.string().hex().length(24).required().messages({
        "string.length": "El idMedico debe tener 24 caracteres hexadecimales",
        "any.required": "El idMedico es obligatorio",
      }),
    }),
  }),
  async (req, res) => {
    try {
      const data = req.body;
      const resultado = await add(data);
      res.status(resultado.statusCode).json(resultado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
