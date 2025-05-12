import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  listarTodos,
  nuevo,
  buscarPorId,
  actualizarPorId,
  eliminarPorId,
  buscarPorIdUser
} from "../controllers/Usuario/user.js";

const router = express.Router();

// Ruta para listar todos los usuarios
router.get("/user/list", async (req, res) => {
  try {
    const response = await listarTodos();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para buscar un usuario por su ID
router.get("/user/:id", async (req, res) => {
  try {
    const response = await buscarPorId(req, res);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear un nuevo usuario
router.post(
  "/user/create",
  celebrate({
    body: Joi.object({
      nombreUsuario: Joi.string().min(3).required(), // Aseguramos que el nombre sea una cadena y tenga al menos 3 caracteres
      passwordUser: Joi.string().min(6).required(), // La contraseña debe tener al menos 6 caracteres
      emailUser: Joi.string().email().required(), // El email debe ser válido
      rol: Joi.string().valid("admin", "user").required(), // El rol debe ser 'admin' o 'user'
      pacienteId: Joi.string().hex().length(24).required() // ID del paciente, que debe ser un ObjectId
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await nuevo(data); // Llamamos la función que guarda el nuevo usuario
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message }); // En caso de error, respondemos con el mensaje de error
    }
  }
);

// Ruta para actualizar un usuario existente
router.post(
  "/user/update",
  celebrate({
    body: Joi.object({
      id: Joi.string().hex().length(24).required(), // ID del usuario (debe ser un ObjectId)
      nombreUsuario: Joi.string().min(3).required(), // El nombre debe tener al menos 3 caracteres
      passwordUser: Joi.string().min(6).optional(), // Contraseña opcional (si se desea actualizar)
      emailUser: Joi.string().email().required(), // El email debe ser válido
      rol: Joi.string().valid("admin", "user").required() // Rol debe ser uno de los definidos
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await actualizarPorId(data); // Llamamos la función para actualizar el usuario
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Ruta para eliminar un usuario por ID
router.post(
  "/user/delete",
  celebrate({
    body: Joi.object({
      id: Joi.string().hex().length(24).required() // ID del usuario (debe ser un ObjectId)
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await eliminarPorId(data); // Llamamos la función para eliminar el usuario
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Ruta para verificar si un usuario está relacionado con un paciente
router.get("/user/:id/related", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await buscarPorIdUser(req, res);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
