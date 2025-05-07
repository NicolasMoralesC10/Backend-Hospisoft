import express from "express";
import usuarioController from "../controllers/Usuario/user.js";

const router = express.Router();

// Rutas que entrega la API
router.get("/usuario/listartodos", usuarioController.listarTodos);
router.get("/usuario/listarPorId/:id", usuarioController.buscarPorId);
router.get("/usuario/listarPorIdUser/:id", usuarioController.buscarPorIdUser);
router.post("/usuario/nuevo", usuarioController.nuevo);
router.put("/usuario/actualizar/:id", usuarioController.actualizarPorId);
router.delete("/usuario/eliminar/:id", usuarioController.eliminarPorId);
//router.post("/usuario/login", usuarioController.login);

// Agrega más rutas según sea necesario

export default router;
