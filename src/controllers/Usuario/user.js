import Usuarios from "../../models/Usuario/user.js";
import Patient from "../../models/Paciente/patient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

// Funciones de la librería

const listarTodos = async (req, res) => {
  try {
    // Consultar todos sin filtro
    const listarUsuarios = await Usuarios.find().exec();
    res.status(200).send({
      exito: true,
      listarUsuarios,
    });
  } catch (error) {
    res.status(500).send({
      exito: false,
      mensaje: "Error en la consulta",
    });
  }
};

const nuevo = async (req, res) => {
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
};

const buscarPorId = async (req, res) => {
  let id = req.params.id;

  try {
    //Logica de buscar  mostrar el resultado
    //let consulta = await producto.find(id).exec();
    let consulta = await Usuarios.findById(id).exec();

    return res.send({
      estado: true,
      mensaje: `Busqueda exitosa`,
      consulta: consulta,
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `Error, no se pudo realizar la consulta`,
    });
  }
};

const buscarPorIdUser = async (req, res) => {
  const idUsuario = req.params.id;

  try {
    const usuarioId = new mongoose.Types.ObjectId(idUsuario);

    const pacienteRelacionado = await Patient.findOne({ idUsuario: usuarioId }).exec();

    if (pacienteRelacionado) {
      return res.send({
        estado: true,
        relacionado: true,
        mensaje: "El usuario está relacionado con un paciente.",
        paciente: pacienteRelacionado,
      });
    } else {
      return res.send({
        estado: true,
        relacionado: false,
        mensaje: "El usuario no está relacionado con ningún paciente.",
      });
    }
  } catch (error) {
    console.error("Error en la verificación:", error);
    return res.status(500).send({
      estado: false,
      mensaje: "Error al verificar la relación con paciente.",
    });
  }
};

//Actualizar de acuerdo al producto al id del producto

const actualizarPorId = async (req, res) => {
  //Recibe el parametro de la consulta

  let id = req.params.id;

  let datos = {
    username: req.body.username,
    email: req.body.email,
    rol: req.body.rol,
    status: req.body.status || 1,
  };

  if (req.body.password && req.body.password.trim() !== "") {
    // Aquí debes hashear la contraseña antes de guardar
    datos.password = /* hashPassword( */ req.body.password /* ) */; // Reemplaza con tu función de hash
  }

  try {
    let consulta = await Usuarios.findByIdAndUpdate(id, datos).exec();
    return res.send({
      estado: true,
      mensaje: `Actualizacion exitosa`,
      consulta: consulta,
    });
  } catch (error) {
    return res.send({
      estado: true,
      mensaje: `Error al actualizar`,
      consulta: consulta,
    });
  }
};

const eliminarPorId = async (req, res) => {
  let id = req.params.id;

  try {
    //Logica de buscar  mostrar el resultado
    //let consulta = await producto.find(id).exec();
    let consulta = await Usuarios.findOneAndDelete({ _id: id }).exec();

    return res.send({
      estado: true,
      mensaje: `Eliminacion exitosa`,
      consulta: consulta,
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `Error, no se pudo realizar la consulta`,
    });
  }
};

export default {
  listarTodos,
  nuevo,
  buscarPorId,
  actualizarPorId,
  eliminarPorId,
  buscarPorIdUser,
};
