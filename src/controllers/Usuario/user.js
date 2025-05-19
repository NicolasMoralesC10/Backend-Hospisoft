import Usuarios from "../../models/Usuario/user.js";
import Medico from "../../models/Medico/medico.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export const listarTodos = async (req, res) => {
  try {
    const listaUsuarios = await Usuarios.find({ status: { $gt: 0 } }).exec();
    res.status(200).send({
      estado: true,
      data: listaUsuarios,
    });
  } catch (error) {
    res.status(500).send({
      estado: false,
      mensaje: `Error: ${error.message}`,
    });
  }
};

export const nuevo = async (data) => {
  try {
    const userExist = await Usuarios.findOne({
      $and: [{ $or: [{ username: data.username }, { email: data.email }] }, { status: { $ne: 0 } }],
    });

    if (userExist) {
      let mensaje = "El usuario ya existe en el sistema";
      if (userExist.username === data.username && userExist.email === data.email) {
        mensaje = "Nombre de usuario y correo electrónico ya registrados";
      } else if (userExist.username === data.username) {
        mensaje = "Nombre de usuario ya registrado";
      } else if (userExist.email === data.email) {
        mensaje = "Correo electrónico ya registrado";
      }

      return {
        estado: false,
        mensaje,
        statusCode: 409, // Conflict
        tipoError: "duplicado",
      };
    }

    const { username, password, email, rol } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Usuarios.create({
      username,
      password: hashedPassword,
      email,
      rol,
      status: 1,
    });

    return {
      estado: true,
      mensaje: "Usuario registrado exitosamente",
      data: newUser,
      statusCode: 201,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error en el registro: ${error.message}`,
      statusCode: 500,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
};

export const actualizarPorId = async (data) => {
  try {
    const { id, ...updateData } = data;

    const existeOtro = await Usuarios.findOne({
      _id: { $ne: id },
      status: { $ne: 0 },
      $or: [
        ...(updateData.username ? [{ username: updateData.username }] : []),
        ...(updateData.email ? [{ email: updateData.email }] : []),
      ],
    });

    if (existeOtro) {
      let mensaje = "Ya existe un usuario con ese nombre o correo.";
      if (existeOtro.username === updateData.username && existeOtro.email === updateData.email) {
        mensaje = "El nombre de usuario y correo electrónico ya están en uso.";
      } else if (existeOtro.username === updateData.username) {
        mensaje = "El nombre de usuario ya está en uso.";
      } else if (existeOtro.email === updateData.email) {
        mensaje = "El correo electrónico ya está en uso.";
      }

      return {
        estado: false,
        mensaje,
        statusCode: 409,
        tipoError: "duplicado",
      };
    }

    const updatePayload = {
      ...updateData,
      ...(updateData.password && {
        password: await bcrypt.hash(updateData.password, await bcrypt.genSalt(10)),
      }),
    };

    const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!usuarioActualizado) {
      return {
        estado: false,
        mensaje: "Usuario no encontrado",
        statusCode: 404,
      };
    }

    return {
      estado: true,
      mensaje: "Actualización exitosa",
      data: usuarioActualizado,
      statusCode: 200,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error en la actualización: ${error.message}`,
      statusCode: 500,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
      result: usuario,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`,
    };
  }
};

export const buscarMedicoPorIdUser = async (data) => {
  try {
    const usuarioId = new Types.ObjectId(data.id);
    const medicoRelacionado = await Medico.findOne({
      idUsuario: usuarioId,
    }).exec();

    return {
      estado: true,
      relacionado: !!medicoRelacionado,
      mensaje: medicoRelacionado
        ? "El usuario está relacionado con un medico."
        : "El usuario no está relacionado con ningún medico.",
      medico: medicoRelacionado || null,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`,
    };
  }
};

export const eliminarPorId = async (data) => {
  try {
    const id = data.id;

    const usuarioEliminado = await Usuarios.findByIdAndUpdate(id, {
      status: 0,
    });

    return {
      estado: true,
      mensaje: "Usuario eliminado (estado desactivado)",
      result: usuarioEliminado,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`,
    };
  }
};

export const rollback = async (data) => {
  try {
    const id = data.id;

    const usuarioEliminado = await Usuarios.findByIdAndDelete(id);

    return {
      estado: true,
      mensaje: "Usuario eliminado (rollback)",
      result: usuarioEliminado,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`,
    };
  }
};
