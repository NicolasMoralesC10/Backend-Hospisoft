// controlador medico
import Diagnostico from "../../models/Diagnostico/diagnostico.js";
import Patients from "../../models/Paciente/patient.js";

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
      {
        $lookup: {
          //$lookup : para unir con la colección patients
          from: "pacientes",
          localField: "patientId",
          foreignField: "_id",
          as: "patient"
        }
      },
      { $unwind: "$patient" }, // $unwind : convierte el array patient en un solo objeto
      { $match: { "patient.documento": Number(documento) } } // filtra por documento
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
  console.log(data)
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
