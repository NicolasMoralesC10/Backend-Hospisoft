import jwt from "jsonwebtoken";
import Usuario from "../models/User/user.js";

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

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario || usuario.status === 0) {
      return res.status(401).json({ error: "Usuario no válido" });
    }

    // Si la verificación es exitosa, se almacena la info del usuario en req.user
    req.user = usuario;
    next(); // Permite el acceso a la ruta protegida
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};
