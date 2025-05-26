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
  try {
    const medicoExist = await Medicos.findOne({
      $or: [{ documento: data.documento }, { telefono: data.telefono }],
      status: { $ne: 0 },
    });

    if (medicoExist) {
      let mensaje = "El médico ya existe en el sistema";
      if (medicoExist.documento === data.documento && medicoExist.telefono === data.telefono) {
        mensaje = "Documento y teléfono ya registrados";
      } else if (medicoExist.documento === data.documento) {
        mensaje = "Documento ya registrado";
      } else if (medicoExist.telefono === data.telefono) {
        mensaje = "Teléfono ya registrado";
      }

      return {
        estado: false,
        mensaje,
        statusCode: 409,
        tipoError: "duplicado",
        campoDuplicado:
          medicoExist.documento === data.documento
            ? medicoExist.telefono === data.telefono
              ? ["documento", "telefono"]
              : ["documento"]
            : ["telefono"],
      };
    }

    const medicoNuevo = await Medicos.create({
      nombre: data.nombre,
      documento: data.documento,
      telefono: data.telefono,
      especialidad: data.especialidad,
      idUsuario: new Types.ObjectId(data.idUsuario),
      status: 1,
    });

    return {
      estado: true,
      mensaje: "Médico registrado exitosamente",
      data: medicoNuevo,
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

export const updateMedico = async (data) => {
  try {
    const { id, ...updateData } = data;

    const existeOtro = await Medicos.findOne({
      _id: { $ne: id },
      status: { $ne: 0 },
      $or: [
        ...(updateData.documento ? [{ documento: updateData.documento }] : []),
        ...(updateData.telefono ? [{ telefono: updateData.telefono }] : []),
      ],
    });

    if (existeOtro) {
      let mensaje = "Datos duplicados";
      const campos = [];

      if (
        existeOtro.documento === updateData.documento &&
        existeOtro.telefono === updateData.telefono
      ) {
        mensaje = "Documento y teléfono ya registrados";
        campos.push("documento", "telefono");
      } else if (existeOtro.documento === updateData.documento) {
        mensaje = "Documento ya registrado";
        campos.push("documento");
      } else if (existeOtro.telefono === updateData.telefono) {
        mensaje = "Teléfono ya registrado";
        campos.push("telefono");
      }

      return {
        estado: false,
        mensaje,
        statusCode: 409,
        tipoError: "duplicado",
        camposDuplicados: campos,
      };
    }

    const medicoActualizado = await Medicos.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!medicoActualizado) {
      return {
        estado: false,
        mensaje: "Médico no encontrado",
        statusCode: 404,
      };
    }

    return {
      estado: true,
      mensaje: "Actualización exitosa",
      data: medicoActualizado,
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
