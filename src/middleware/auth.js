import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario/user.js";

export const authenticate = async (req, res, next) => {
  // Obtener el token desde el header Authorization (Bearer token)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extrae el token

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado: token requerido" });
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).populate("rol", "nombre");
    if (!usuario || usuario.status === 0) {
      return res.status(401).json({ error: "Usuario no válido" });
    }

    // Si la verificación es exitosa, se almacena la info del usuario en req.user
    req.user = usuario;
    /* req.user = {
      _id: usuario._id,
      username: usuario.username,
      rol: usuario.rol.nombre,
    }; */

    next(); // Permite el acceso a la ruta protegida
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

export const verifyRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Populate del rol para obtener el nombre (requiere ajuste en el modelo)
      const usuario = await Usuario.findById(req.user._id).populate("rol", "nombre");

      if (!usuario) return res.status(403).json({ error: "Usuario no encontrado" });

      const rolUsuario = usuario.rol?.nombre;
      
      if (!allowedRoles.includes(rolUsuario)) {
        return res.status(403).json({ error: "Acceso restringido: Rol no autorizado" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Error en verificación de rol" });
    }
  };
};
