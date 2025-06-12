import Rol from "../models/Roles/roles.js";

export const crearRoles = async () => {
  const defaultRoles = ["superuser", "admin", "secretaria", "medico", "paciente", "dispensario"];

  try {
    for (const nombre of defaultRoles) {
      await Rol.findOneAndUpdate(
        { nombre: nombre.toLowerCase() }, // Buscar en minúscula
        { $setOnInsert: { nombre: nombre.toLowerCase(), descripcion: null } },
        { upsert: true, new: true }
      );
    }
    console.log("Roles verificados/creados exitosamente");
  } catch (error) {
    console.error("Error inicializando roles:", error);
  }
};
