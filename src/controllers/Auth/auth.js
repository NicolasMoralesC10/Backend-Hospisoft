import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../../models/User/user.js";
import dotenv from "dotenv";
dotenv.config();

export const login = async (data) => {
  try {
    const { email, password } = data;

    const usuario = await Usuario.findOne({ email }).populate("rol", "nombre permisos").select("+password");

    if (!usuario) throw new Error("Credenciales inválidas");
    if (usuario.status === 0) throw new Error("Cuenta desactivada");
    if (!usuario.rol) throw new Error("El usuario no tiene un rol asignado");

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) throw new Error("Credenciales inválidas");

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        rol: usuario.rol.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return {
      token,
      user: {
        id: usuario._id,
        email: usuario.email,
        username: usuario.username,
        rol: usuario.rol.nombre
      }
    };
  } catch (error) {
    throw error;
  }
};
