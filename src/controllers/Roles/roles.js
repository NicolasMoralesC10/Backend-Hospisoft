import Roles from "../../models/Roles/roles.js";

const listarTodos = async (req, res) => {
  try {
    // Consultar todos sin filtro
    const listarRoles = await Roles.find().exec();
    res.status(200).send({
      exito: true,
      listarRoles
    });
  } catch (error) {
    res.status(500).send({
      exito: false,
      mensaje: "Error en la consulta"
    });
  }
};

const listarMedicos = async (req, res) => {
  try {
    // expresión regular :: comparación sin que importe mayúsculas/minúsculas
    const listarRoles = await Roles.find({ nombreRol: /medico/i }).exec();
    res.status(200).send({
      exito: true,
      listarRoles
    });
  } catch (error) {
    res.status(500).send({
      exito: false,
      mensaje: "Error en la consulta"
    });
  }
};

const listarPaciente = async (req, res) => {
  try {
    // expresión regular :: comparación sin que importe mayúsculas/minúsculas
    const listarRoles = await Roles.find({ nombreRol: /paciente/i }).exec();
    res.status(200).send({
      exito: true,
      listarRoles
    });
  } catch (error) {
    res.status(500).send({
      exito: false,
      mensaje: "Error en la consulta"
    });
  }
};

const nuevo = async (req, res) => {
  let datos = {
    nombreRol: req.body.nombreRol,
    descripcionRol: req.body.descripcionRol
  };

  try {
    const rolNuevo = new Roles(datos);

    rolNuevo.save(); //Escribe el mongo

    return res.send({
      estado: true,
      mensaje: `Insercion exitosa`
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `A ocurrido un error en la consulta ${error}`
    });
  }
};

const buscarPorId = async (req, res) => {
  let id = req.params.id;

  try {
    //Logica de buscar  mostrar el resultado
    //let consulta = await producto.find(id).exec();
    let consulta = await Roles.findById(id).exec();

    return res.send({
      estado: true,
      mensaje: `Busqueda exitosa`,
      consulta: consulta
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `Error, no se pudo realizar la consulta`
    });
  }
};

const actualizarPorId = async (req, res) => {
  //Recibe el parametro de la consulta
  let id = req.params.id;

  let datos = {
    nombreRol: req.body.nombreRol,
    descripcionRol: req.body.descripcionRol
  };

  try {
    let consulta = await Roles.findByIdAndUpdate(id, datos).exec();
    return res.send({
      estado: true,
      mensaje: `Actualizacion exitosa`,
      consulta: consulta
    });
  } catch (error) {
    return res.send({
      estado: true,
      mensaje: `Error al actualizar`,
      consulta: consulta
    });
  }
};

const eliminarPorId = async (req, res) => {
  let id = req.params.id;

  try {
    let consulta = await Roles.findOneAndDelete({ _id: id }).exec();

    return res.send({
      estado: true,
      mensaje: `Eliminacion exitosa`,
      consulta: consulta
    });
  } catch (error) {
    return res.send({
      estado: false,
      mensaje: `Error, no se pudo realizar la consulta`
    });
  }
};

export default {
  eliminarPorId,
  listarTodos,
  nuevo,
  listarPaciente,
  listarMedicos,
  actualizarPorId,
  buscarPorId
};
