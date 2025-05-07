import express, { json } from "express";

const router = express.Router();
import {
  getAll,
  add,
  updatePatient,
  searchById,
  subirImagen,
  deleteById,
  avatar,
} from "../controllers/Paciente/patient.js";

import { celebrate, Joi, errors, Segments } from "celebrate";

router.get("/patient/list", async (req, res) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de pacientes" });
  }
});
router.get("/patient/img/", async (req, res) => {
  try {
    const response = await avatar();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen" });
  }
});

router.get("/patient/:id", async (req, res) => {
  try {
    const data = req.params.id;
    const response = await searchById({ id: data });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la información" });
  }
});


router.post(
  "/patient/create",
  celebrate({
    body: Joi.object({
      nombre: Joi.string().required(),
      fecha: Joi.date().required(),
      documento: Joi.number().required(),
      telefono: Joi.number().required(),
      eps: Joi.string().required(),
      idUsuario: Joi.string().hex().length(24).required(),
      estadoCivil: Joi.string().required(),
      sexo: Joi.string().required(),
      direccion: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await add(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al Registrar el Paciente" });
    }
  }
);

router.post(
  "/patient/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().required(),
      nombre: Joi.string().required(),
      fecha: Joi.date().required(),
      documento: Joi.number().required(),
      eps: Joi.string().required(),
      telefono: Joi.number().required(),
      estadoCivil: Joi.string().required(),
      sexo: Joi.string().required(),
      direccion: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await updatePatient(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar" });
    }
  }
);

router.post(
  "/patient/delet",
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
      res.status(500).json({ message: "Error al eliminar" });
    }
  }
);

export default router;
