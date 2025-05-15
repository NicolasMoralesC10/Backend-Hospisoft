import express from "express";
import rolesController from "../controllers/Role/role.js";

const router = express.Router();

// Rutas que entrega la API
router.get("/roles/listartodos", rolesController.listarTodos);
router.get("/roles/listarPorId/:id", rolesController.buscarPorId);
router.get("/roles/listarmedicos", rolesController.listarMedicos);
router.get("/roles/listarpacientes", rolesController.listarPaciente);
router.post("/roles/nuevo", rolesController.nuevo);
router.put("/roles/actualizar/:id", rolesController.actualizarPorId);
router.delete("/roles/eliminar/:id", rolesController.eliminarPorId);
//router.post("/usuario/login", usuarioController.login);


export default router;
