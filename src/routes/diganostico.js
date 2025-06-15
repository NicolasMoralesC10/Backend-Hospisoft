import express from "express";

const router = express.Router();
import { getAll, add, deleteById } from "../controllers/Diagnostico/diganostico.js";

import { celebrate, Joi, errors } from "celebrate";
const schema = Joi.object({
  fecha: Joi.string().required(),
  medicoId: Joi.string().required(),
  pacienteId: Joi.string().required(),
  motivoConsulta: Joi.string().required(),
  diagPrincipal: Joi.string().required(),
  diagSecundario: Joi.string().required(),
  historia: Joi.string().required(),
  examenFisico: Joi.array().required(),
  evoClinica: Joi.string().required(),
  medicamentos: Joi.array().required(),
  prioridad: Joi.string().required().valid("Alta", "Media", "Baja")
});

router.get("/diagnostico/list/:documento", async (req, res) => {
  try {
    const data = req.params.documento;
    const response = await getAll(data);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: `Error al obtener los diganostico del paciente: ${data}`
    });
  }
});

router.post(
  "/diagnostico/create",
  celebrate({
    body: schema
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await add(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: `Error al crear un diganostico`,
        error: `${error}`
      });
    }
  }
);

router.post(
  "/diagnostico/delet",
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
      res.status(500).json({ message: "Error al eliminar" });
    }
  }
);

router.use(errors());
export default router;
