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

export const create = async (data) => {
  const userExist = await Usuarios.findOne({
    $or: [{ username: data.username }, { email: data.email }]
  });

  if (userExist) {
    let mensaje = "El usuario ya existe en el sistema";
    if (userExist.username === data.username) {
      mensaje = "El nombre de usuario ya está registrado";
    } else if (userExist.email === data.email) {
      mensaje = "El correo electrónico ya está registrado";
    }

    return {
      estado: false,
      mensaje
    };
  }

  try {
    const { username, password, email, rol } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuarios({
      username,
      password: hashedPassword,
      email,
      rol,
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

export const update = async (data) => {
  try {
    const id = data.id;

    const existeOtro = await Usuarios.findOne({
      _id: { $ne: id }, // Excluye al usuario que se está editando
      $or: [{ username: data.username }, { email: data.email }]
    });

    if (existeOtro) {
      let mensaje = "Ya existe un usuario con ese nombre o correo.";
      if (existeOtro.username === data.username) {
        mensaje = "El nombre de usuario ya está en uso.";
      } else if (existeOtro.email === data.email) {
        mensaje = "El correo electrónico ya está en uso.";
      }

      return {
        estado: false,
        mensaje
      };
    }

    const datos = {
      username: data.username,
      email: data.email,
      rol: data.rol,
      status: data.status || 1
    };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      datos.password = await bcrypt.hash(data.password, salt);
    }

    const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, datos, { new: true });

    return {
      estado: true,
      mensaje: "Actualización exitosa",
      result: usuarioActualizado,
      id: id
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`
    };
  }
};

export const buscarPorId = async (data) => {
  const id = data.id;
  try {
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
