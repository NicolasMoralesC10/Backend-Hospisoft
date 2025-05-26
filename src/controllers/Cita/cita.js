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
    const fechaConsulta = new Date(data.fecha);

    const citaExist = await Cita.findOne({
      idMedico: new Types.ObjectId(data.idMedico),
      idPaciente: new Types.ObjectId(data.idPaciente),
      fecha: fechaConsulta,
      status: 1,
    });

    if (citaExist) {
      return {
        estado: false,
        mensaje: "Ya existe una cita para este médico y paciente en la fecha indicada.",
        statusCode: 409,
        tipoError: "duplicado",
      };
    }

    const citaPaciente = await Cita.findOne({
      idPaciente: new Types.ObjectId(data.idPaciente),
      fecha: fechaConsulta,
      status: 1,
    }).populate("idPaciente");

    if (citaPaciente) {
      return {
        estado: false,
        mensaje: `El paciente ${citaPaciente.idPaciente.nombrePaciente} ya tiene una cita para la fecha indicada.`,
        statusCode: 409,
        tipoError: "duplicado_paciente",
      };
    }

    const citaMedico = await Cita.findOne({
      idMedico: new Types.ObjectId(data.idMedico),
      fecha: fechaConsulta,
      status: 1,
    }).populate("idMedico");

    if (citaMedico) {
      return {
        estado: false,
        mensaje: `El médico ${citaMedico.idMedico.nombre} ya tiene una cita para la fecha indicada.`,
        statusCode: 409,
        tipoError: "duplicado_medico",
      };
    }

    // Crear la nueva cita
    const citaNueva = await Cita.create({
      fecha: fechaConsulta,
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
      mensaje: "Cita agendada correctamente.",
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

export const update = async (data) => {
  try {
    const id = data.id;
    const fechaConsulta = new Date(data.fecha);

    const citaExist = await Cita.findOne({
      _id: { $ne: id }, // Excluye la cita que se está actualizando
      idMedico: new Types.ObjectId(data.idMedico),
      idPaciente: new Types.ObjectId(data.idPaciente),
      fecha: fechaConsulta,
      status: 1,
    });

    if (citaExist) {
      return {
        estado: false,
        mensaje: "Ya existe una cita para este médico y paciente en la fecha indicada.",
        statusCode: 409,
        tipoError: "duplicado",
      };
    }

    // Valida si el paciente ya tiene otra cita en esa fecha (excluyendo la actual)
    const citaPaciente = await Cita.findOne({
      _id: { $ne: id },
      idPaciente: new Types.ObjectId(data.idPaciente),
      fecha: fechaConsulta,
      status: 1,
    }).populate("idPaciente");

    if (citaPaciente) {
      return {
        estado: false,
        mensaje: `El paciente ${citaPaciente.idPaciente.nombrePaciente} ya tiene una cita para la fecha indicada.`,
        statusCode: 409,
        tipoError: "duplicado_paciente",
      };
    }

    // Valida si el médico ya tiene otra cita en esa fecha (excluyendo la actual)
    const citaMedico = await Cita.findOne({
      _id: { $ne: id },
      idMedico: new Types.ObjectId(data.idMedico),
      fecha: fechaConsulta,
      status: 1,
    }).populate("idMedico");

    if (citaMedico) {
      return {
        estado: false,
        mensaje: `El médico ${citaMedico.idMedico.nombre} ya tiene una cita para la fecha indicada.`,
        statusCode: 409,
        tipoError: "duplicado_medico",
      };
    }

    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      {
        fecha: fechaConsulta,
        descripcion: data.descripcion,
        idPaciente: new Types.ObjectId(data.idPaciente),
        idMedico: new Types.ObjectId(data.idMedico),
        status: data.status,
      },
      { new: true } // Devuelve el documento actualizado
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
