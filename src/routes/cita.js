import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { getAll, add, update, cancel } from "../controllers/Cita/cita.js";

const router = express.Router();

// Obtener citas activas
router.get("/list", async (req, res) => {
  try {
    const resultado = await getAll(req);
    if (resultado.estado) {
      res.status(200).json(resultado);
    } else {
      res.status(500).json({ message: resultado.mensaje });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Nueva cita
router.post(
  "/create",
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

// Actualizar cita
router.put(
  "/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().hex().length(24).required(),
      fecha: Joi.date().required(),
      descripcion: Joi.string().trim().min(3).required(),
      idPaciente: Joi.string().hex().length(24).required(),
      idMedico: Joi.string().hex().length(24).required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await update(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Cancelar cita (cambiar status a 0)
router.put(
  "/cancel",
  celebrate({
    body: Joi.object({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  async (req, res) => {
    try {
      const { id } = req.body;
      const resultado = await cancel(id);
      res.status(resultado.statusCode).json(resultado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
