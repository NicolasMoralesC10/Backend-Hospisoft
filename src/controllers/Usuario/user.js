import Usuarios from "../../models/Usuario/user.js";
import Patient from "../../models/Paciente/patient.js";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";


export const listarTodos = async () => {
  try {
    const listaUsuarios = await Usuarios.find({ status: { $gt: 0 } });
    return {
      estado: true,
      data: listaUsuarios
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const nuevo = async (data) => {
  try {
    const { nombreUsuario, passwordUser, emailUser, rol, pacienteId } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordUser, salt);

    const nuevoUsuario = new Usuarios({
      nombreUsuario,
      passwordUser: hashedPassword,
      emailUser,
      rol,
      pacienteId: new Types.ObjectId(pacienteId),
      status: 1
    });

    await nuevoUsuario.save();

    return {
      estado: true,
      mensaje: "Usuario registrado exitosamente",
      id: nuevoUsuario._id
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const buscarPorId = async (data) => {
  try {
    const id = data.id;
    const usuario = await Usuarios.findById(id);

    return {
      estado: true,
      mensaje: "Consulta exitosa",
      result: usuario
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const buscarPorIdUser = async (data) => {
  try {
    const usuarioId = new Types.ObjectId(data.id);
    const pacienteRelacionado = await Patient.findOne({ idUsuario: usuarioId }).exec();

    return {
      estado: true,
      relacionado: !!pacienteRelacionado,
      mensaje: pacienteRelacionado
        ? "El usuario está relacionado con un paciente."
        : "El usuario no está relacionado con ningún paciente.",
      paciente: pacienteRelacionado || null
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const actualizarPorId = async (data) => {
  try {
    const id = data.id;

    const datos = {
      nombreUsuario: data.nombreUsuario,
      passwordUser: data.passwordUser,
      emailUser: data.emailUser,
      rol: data.rol,
      status: data.status || 1
    };

    const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, datos, { new: true });

    return {
      estado: true,
      mensaje: "Actualización exitosa",
      result: usuarioActualizado
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const eliminarPorId = async (data) => {
  try {
    const id = data.id;

    const usuarioEliminado = await Usuarios.findByIdAndUpdate(id, { status: 0 });

    return {
      estado: true,
      mensaje: "Usuario eliminado (estado desactivado)",
      result: usuarioEliminado
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};
