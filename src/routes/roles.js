import express from "express";
import rolesController from "../controllers/Roles/roles.js";

const router = express.Router();

// Rutas que entrega la API
router.get("/roles/listartodos", rolesController.listarTodos);
router.get("/roles/listarPorId/:id", rolesController.buscarPorId);
router.post("/roles/nuevo", rolesController.nuevo);
router.put("/roles/actualizar/:id", rolesController.actualizarPorId);
router.delete("/roles/eliminar/:id", rolesController.eliminarPorId);
//router.post("/usuario/login", usuarioController.login);

// Agrega más rutas según sea necesario

export default router;
