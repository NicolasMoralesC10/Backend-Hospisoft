import Cita from "../../models/Cita/cita.js";
import { Types } from "mongoose";

export const getAll = async () => {
  try {
    let allCitas = await Cita.find({ status: 1 })
      .populate("idPaciente")
      .populate("idMedico")
      .exec();

    // Mapeo para adaptar al formato de FullCalendar
    const eventos = allCitas.map((cita) => ({
      id: cita._id,
      title: cita.descripcion,
      start: cita.fecha.toISOString(),
      extendedProps: {
        paciente: cita.idPaciente,
        medico: cita.idMedico,
        status: cita.status,
      },
    }));

    return {
      estado: true,
      data: eventos,
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
    // Validar cita duplicada
    const citaExist = await Cita.findOne({
      idMedico: new Types.ObjectId(data.idMedico),
      idPaciente: new Types.ObjectId(data.idPaciente),
      fecha: new Date(data.fecha),
      status: 1,
    });

    if (citaExist) {
      return {
        estado: false,
        mensaje: "Ya existe una cita activa para este médico y paciente en la fecha indicada",
        statusCode: 409,
        tipoError: "duplicado",
      };
    }

    // Crear la nueva cita
    const citaNueva = await Cita.create({
      fecha: new Date(data.fecha),
      descripcion: data.descripcion,
      idPaciente: new Types.ObjectId(data.idPaciente),
      idMedico: new Types.ObjectId(data.idMedico),
      status: 1,
    });

    // Poblar referencias para enviar datos completos
    const citaPopulada = await Cita.findById(citaNueva._id)
      .populate("idPaciente")
      .populate("idMedico")
      .exec();

    // Adaptar para FullCalendar
    const eventoAdaptado = {
      id: citaPopulada._id,
      title: citaPopulada.descripcion,
      start: citaPopulada.fecha.toISOString(),
      extendedProps: {
        paciente: citaPopulada.idPaciente,
        medico: citaPopulada.idMedico,
        status: citaPopulada.status,
      },
    };

    return {
      estado: true,
      mensaje: "Cita agendada correctamente",
      data: eventoAdaptado,
      statusCode: 201,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error en el registro de la cita: ${error.message}`,
      statusCode: 500,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
};

export const update = async (id, data) => {
  try {
    // Actualizar la cita por id
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      {
        fecha: new Date(data.fecha),
        descripcion: data.descripcion,
        idPaciente: new Types.ObjectId(data.idPaciente),
        idMedico: new Types.ObjectId(data.idMedico),
        status: data.status,
      },
      { new: true } // Para que devuelva el documento actualizado
    )
      .populate("idPaciente")
      .populate("idMedico")
      .exec();

    if (!citaActualizada) {
      return {
        estado: false,
        mensaje: "Cita no encontrada",
        statusCode: 404,
      };
    }

    // Adaptar para FullCalendar
    const eventoAdaptado = {
      id: citaActualizada._id,
      title: citaActualizada.descripcion,
      start: citaActualizada.fecha.toISOString(),
      extendedProps: {
        paciente: citaActualizada.idPaciente,
        medico: citaActualizada.idMedico,
        status: citaActualizada.status,
      },
    };

    return {
      estado: true,
      mensaje: "Cita actualizada correctamente",
      data: eventoAdaptado,
      statusCode: 200,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error al actualizar la cita: ${error.message}`,
      statusCode: 500,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
};

/* ---------------------------------------------------- */

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
