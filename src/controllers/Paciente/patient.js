import Patients from "../../models/Paciente/patient.js";
import Usuarios from "../../models/Usuario/user.js";
import { Types } from "mongoose";

export const getAll = async () => {
  try {
    let listaPacientes = await Patients.find({ status: { $gt: 0 } })
      .populate("idUsuario") // Con esto relaciona el campo y segunel id, trae los datos del usuario
      .exec();

    // Ahora, por cada paciente, buscamos el usuario relacionado
    const pacientesConUsuario = await Promise.all(
      listaPacientes.map(async (paciente) => {
        // Buscar el usuario relacionado por el campo idUsuario
        const usuario = await Usuarios.findById(paciente.idUsuario).exec();

        // Devolver el paciente con su usuario relacionado
        return {
          ...paciente.toObject(),
          usuario: usuario || null // Si no se encuentra el usuario, dejamos null
        };
      })
    );

    return {
      estado: true,
      data: pacientesConUsuario
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const add = async (data) => {
  const patientExist = await Patients.findOne({ documento: data.documento });
  if (patientExist) {
    return {
      estado: false,
      mensaje: "El Paciente ya existe en el sistema"
    };
  }

  try {
    const patientNuevo = new Patients({
      nombrePaciente: data.nombre,
      documento: data.documento,
      telefonoPaciente: data.telefono,
      fechaNacimiento: data.nacimiento,
      epsPaciente: data.eps,
      idUsuario: new Types.ObjectId(data.idUsuario),
      estadoCivil: data.estadoCivil,
      sexo: data.sexo,
      direccion: data.direccion,
      status: 1
    });
    await patientNuevo.save();
    return {
      estado: true,
      mensaje: "Paciente Registrado exitosamente"
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const updatePatient = async (data) => {
  let id = data.id;
  let info = {
    nombrePaciente: data.nombre,
    documento: data.documento,
    emailPaciente: data.email,
    telefonoPaciente: data.telefono,
    fechaNacimiento: data.nacimiento,
    epsPaciente: data.eps
  };
  try {
    let patientUpdate = await Patients.findByIdAndUpdate(id, info);
    return {
      estado: true,
      mensaje: "Actualizacion Exitosa!",
      result: patientUpdate
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const searchById = async (data) => {
  let id = data.id;
  try {
    let result = await Patients.findById(id).populate("idUsuario").exec();

    return {
      estado: true,
      mensaje: "Consulta Exitosa",
      result: result
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
    let result = await Patients.findByIdAndUpdate(id, { status: 0 });
    return {
      estado: true,
      result: result
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const subirImagen = async (req, res) => {
  try {
    // Validar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        estado: false,
        mensaje: "No se ha subido ninguna imagen"
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
        mensaje: "Extensión de archivo no permitida"
      });
    }

    // Actualizar usuario con la imagen subida
    const usuarioActualizado = await _findByIdAndUpdate(req.body.id, {
      imagen: filename
    });

    return res.status(200).json({
      estado: true,
      user: usuarioActualizado
      //file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      estado: false,
      nensaje: "Error al procesar la imagen",
      error: error.message
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
        message: "No existe la imagen"
      });
    }

    // Devolver un file
    return res.sendFile(resolve(filePath));
  });
};
