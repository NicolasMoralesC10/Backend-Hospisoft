import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { getAll, add } from "../controllers/Cita/cita.js";

const router = express.Router();

// Ruta para obtener todas las citas activas
router.get("/cita/list", async (req, res) => {
  try {
    const resultado = await getAll();
    if (resultado.estado) {
      res.status(200).json(resultado);
    } else {
      res.status(500).json({ message: resultado.mensaje });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear una nueva cita
router.post(
  "/cita/create",
  celebrate({
    body: Joi.object({
      fecha: Joi.date().required(),
      descripcion: Joi.string().trim().min(3).required(),
      idPaciente: Joi.string().hex().length(24).required(),
      idMedico: Joi.string().hex().length(24).required(),
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
