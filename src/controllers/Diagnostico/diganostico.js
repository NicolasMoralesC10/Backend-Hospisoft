// controlador medico
import Diagnostico from "../../models/Diagnostico/diagnostico.js";
import Patients from "../../models/patient/patient.js";

export const getAll = async (documento) => {
  const paciente = await Patients.findOne({ documento: Number(documento) });
  if (!paciente) {
    return {
      estado: false,
      mensaje: `El paciente no Existe en el sistema`
    };
  }
  try {
    const listaDiagnosticos = await Diagnostico.aggregate([
      { $match: { status: "1" } },

      // Lookup para unir con pacientes
      {
        $lookup: {
          from: "pacientes", // nombre de la colección pacientes
          localField: "patientId", // campo en Diagnostico
          foreignField: "_id", // campo en pacientes
          as: "patient"
        }
      },
      { $unwind: "$patient" },

      // Lookup para unir con medicos
      {
        $lookup: {
          from: "medicos", // nombre de la colección médicos (ajusta si es distinto)
          localField: "medicalId", // campo en Diagnostico que referencia al médico
          foreignField: "_id", // campo en medicos
          as: "medico"
        }
      },
      { $unwind: "$medico" },

      // Filtrar por documento del paciente
      { $match: { "patient.documento": Number(documento) } }
    ]);

    return {
      estado: true,
      data: listaDiagnosticos
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const add = async (data) => {
  console.log(data);
  try {
    const diagnosticoNuevo = new Diagnostico({
      fecha: data.fecha,
      medicalId: data.medicoId,
      patientId: data.pacienteId,
      motivoConsulta: data.motivoConsulta,
      diagPrincipal: data.diagPrincipal,
      diagSecundario: data.diagSecundario,
      historia: data.historia,
      examenFisico: data.examenFisico,
      evoClinica: data.evoClinica,
      medicamentos: data.medicamentos,
      prioridad: data.prioridad,
      status: 1
    });
    await diagnosticoNuevo.save();
    return {
      estado: true,
      mensaje: "Se registro el Diagnostico Corectamente"
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};
export const deleteById = async (data) => {
  let id = data.id;
  try {
    let result = await Diagnostico.findByIdAndUpdate(id, { status: 0 });
    return {
      estado: true,
      data: result
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};
