import Medicos from "../../models/Medico/medico.js";
import { Types } from "mongoose";

export const getAll = async () => {
  try {
    let listaMedicos = await Medicos.find({ status: { $gt: 0 } })
      .populate("idUsuario") // Esto relaciona el campo y segun el id, trae los datos del usuario
      .exec();
    return {
      estado: true,
      data: listaMedicos,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const add = async (data) => {
  const medicoExist = await Medicos.findOne({
    $and: [
      { $or: [{ documento: data.documento }, { telefono: data.telefono }] },
      { status: { $ne: 0 } },
    ],
  });

  if (medicoExist) {
    let mensaje = "El medico ya existe en el sistema";
    if (medicoExist.documento === data.documento && medicoExist.telefono === data.telefono) {
      mensaje = "Nombre de documento y telefono ya registrados.";
    } else if (medicoExist.documento === data.documento) {
      mensaje = "Nombre de documento ya registrado.";
    } else if (medicoExist.telefono === data.telefono) {
      mensaje = "Numero de telefono ya registrado.";
    }

    return {
      estado: false,
      mensaje,
    };
  }

  try {
    const medicoNuevo = new Medicos({
      nombre: data.nombre,
      documento: data.documento,
      telefono: data.telefono,
      especialidad: data.especialidad,
      idUsuario: new Types.ObjectId(data.idUsuario),
      status: 1,
    });
    await medicoNuevo.save();
    return {
      estado: true,
      mensaje: "Medico registrado exitosamente.",
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const updateMedico = async (data) => {
  const id = data.id;

  const existeOtro = await Medicos.findOne({
    _id: { $ne: id }, // Excluye al medico que se está editando
    $or: [{ documento: data.documento }, { telefono: data.telefono }],
    status: { $ne: 0 }, // Solo médicos activos
  });

  if (existeOtro) {
    let mensaje = "Ya existe un medico con ese documento o teléfono.";
    if (existeOtro.documento === data.documento && existeOtro.telefono === data.telefono) {
      mensaje = "Numero de documento y teléfono ya registrados.";
    } else if (existeOtro.documento === data.documento) {
      mensaje = "Numero de documento ya registrado.";
    } else if (existeOtro.telefono === data.telefono) {
      mensaje = "Numero de teléfono ya registrado.";
    }

    return {
      estado: false,
      mensaje,
    };
  }

  let info = {
    nombre: data.nombre,
    documento: data.documento,
    telefono: data.telefono,
    especialidad: data.especialidad,
  };
  try {
    let medicoUpdate = await Medicos.findByIdAndUpdate(id, info);
    return {
      estado: true,
      mensaje: "!Actualizacion exitosa!",
      result: medicoUpdate,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const searchById = async (data) => {
  let id = data.id;
  try {
    let result = await Medicos.findById(id).populate("idUsuario").exec();

    return {
      estado: true,
      mensaje: "Consulta exitosa",
      result: result,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const deleteById = async (data) => {
  let id = data.id;
  try {
    let result = await Medicos.findByIdAndUpdate(id, { status: 0 });
    return {
      estado: true,
      result: result,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const subirImagen = async (req, res) => {
  try {
    // Validar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        estado: false,
        mensaje: "No se ha subido ninguna imagen",
      });
    }

    const { originalname, filename, path } = req.file;
    const extension = originalname.split(".").pop().toLowerCase();
    // Validar extensión de la imagen
    const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
    if (!extensionesValidas.includes(extension)) {
      await unlink(path); // Eliminar archivo inválido
      return res.status(400).json({
        estado: false,
        mensaje: "Extensión de archivo no permitida",
      });
    }

    // Actualizar usuario con la imagen subida
    const usuarioActualizado = await _findByIdAndUpdate(req.body.id, {
      imagen: filename,
    });

    return res.status(200).json({
      estado: true,
      user: usuarioActualizado,
      //file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      estado: false,
      nensaje: "Error al procesar la imagen",
      error: error.message,
    });
  }
};

export const avatar = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;

  // Montar el path real de la imagen
  const filePath = "./uploads/usuarios/" + file;

  // Comprobar que existe
  stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen",
      });
    }

    // Devolver un file
    return res.sendFile(resolve(filePath));
  });
};
