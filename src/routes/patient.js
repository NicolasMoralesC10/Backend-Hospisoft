import express, { json } from "express";

const router = express.Router();
import {
  getAll,
  add,
  updatePatient,
  searchById,
  subirImagen,
  deleteById,
  avatar
} from "../controllers/Pacient/patient.js";

import { celebrate, Joi, errors, Segments } from "celebrate";

router.get("/patient/list", async (req, res) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/patient/img/", async (req, res) => {
  try {
    const response = await avatar();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/patient/:id", async (req, res) => {
  try {
    const data = req.params.id;
    const response = await searchById({ id: data });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/patient/create",
  celebrate({
    body: Joi.object({
      nombre: Joi.string().required(),
      nacimiento: Joi.date().required(),
      documento: Joi.number().min(1000000).max(9999999999).required(),
      telefono: Joi.number().min(1000000000).max(9999999999).required(),
      eps: Joi.string().required(),
      idUsuario: Joi.string().hex().length(24).required(),
      estadoCivil: Joi.string().required(),
      sexo: Joi.string().required(),
      direccion: Joi.string().required()
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await add(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/patient/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
      nombre: Joi.string().optional(),
      nacimiento: Joi.date().optional(),
      documento: Joi.number().min(1000000).max(9999999999).optional(),
      eps: Joi.string().optional(),
      telefono: Joi.number().min(1000000000).max(9999999999).optional(),
      estadoCivil: Joi.string().optional(),
      sexo: Joi.string().optional(),
      direccion: Joi.string().optional()
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await updatePatient(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/patient/delet",
  celebrate({
    body: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await deleteById(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
