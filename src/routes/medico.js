import express, { json } from "express";

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

import { celebrate, Joi, errors, Segments } from "celebrate";

router.get("/medico/list", async (req, res) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de medicos." });
  }
});

router.get("/medico/img/", async (req, res) => {
  try {
    const response = await avatar();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen" });
  }
});

router.get("/medico/:id", async (req, res) => {
  try {
    const data = req.params.id;
    const response = await searchById({ id: data });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información" });
  }
});

router.post(
  "/medico/create",
  celebrate({
    body: Joi.object({
      nombre: Joi.string().required(),
      documento: Joi.number().required(),
      telefono: Joi.number().required(),
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
  "/medico/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
      nombre: Joi.string().required(),
      documento: Joi.number().required(),
      telefono: Joi.number().required(),
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

router.post(
  "/medico/delete",
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
