import Usuarios from "../../models/Usuario/user.js";
import Medico from "../../models/Medico/medico.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export const listarTodos = async (req, res) => {
  try {
    // Consultar todos sin filtro
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

/* export const nuevo = async (req, res) => {
  let datos = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    rol: req.body.rol,
    status: req.body.status || 1,
  };

  try {
    const usuarioNuevo = new Usuarios(datos);
    await usuarioNuevo.save();

    return res.send({
      estado: true,
      mensaje: "Inserción exitosa",
      data: usuarioNuevo,
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `Ha ocurrido un error en la consulta: ${error}`,
    });
  }
}; */

export const nuevo = async (data) => {
  const userExist = await Usuarios.findOne({
    $or: [{ username: data.username }, { email: data.email }],
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
      mensaje,
    };
  }

  try {
    const { username, password, email, rol } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Usuarios({
      username,
      password: hashedPassword,
      email,
      rol,
      status: 1,
    });

    await newUser.save();

    return {
      estado: true,
      mensaje: "Usuario registrado exitosamente",
      data: newUser,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error en la consulta: ${error.message}`,
    };
  }
};

export const actualizarPorId = async (data) => {
  try {
    const id = data.id;

    const existeOtro = await Usuarios.findOne({
      _id: { $ne: id }, // Excluye al usuario que se está editando
      $or: [{ username: data.username }, { email: data.email }],
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
        mensaje,
      };
    }

    const datos = {
      username: data.username,
      email: data.email,
      rol: data.rol,
      status: data.status || 1,
    };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      datos.password = await bcrypt.hash(data.password, salt);
    }

    const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, datos, {
      new: true,
    });

    return {
      estado: true,
      mensaje: "Actualización exitosa",
      result: usuarioActualizado,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error.message}`,
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
