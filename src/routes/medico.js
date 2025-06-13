import express, { json } from "express";
import { celebrate, Joi, Segments } from "celebrate";
const router = express.Router();

import {
  getAll,
  add,
  updateMedico,
  searchById,
  subirImagen,
  deleteById,
  avatar,
} from "../controllers/Medico/medico.js";

router.get("/list", async (req, res) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de medicos." });
  }
});

router.get("/img/", async (req, res) => {
  try {
    const response = await avatar();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen" });
  }
});

router.get("/search/:id", async (req, res) => {
  try {
    const data = req.params.id;
    const response = await searchById({ id: data });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información" });
  }
});

router.post(
  "/create",
  celebrate({
    body: Joi.object({
      nombre: Joi.string().min(3).required(),
      documento: Joi.number().min(6).required(),
      telefono: Joi.number().min(6).required(),
      especialidad: Joi.string().required(),
      idUsuario: Joi.string().hex().length(24).required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await add(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el medico." });
    }
  }
);

router.put(
  "/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().hex().length(24).required(),
      nombre: Joi.string().min(3).required(),
      documento: Joi.number().min(6).required(),
      telefono: Joi.number().min(6).required(),
      especialidad: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await updateMedico(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar" });
    }
  }
);

router.put(
  "/delete",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await deleteById(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar." });
    }
  }
);

export default router;
