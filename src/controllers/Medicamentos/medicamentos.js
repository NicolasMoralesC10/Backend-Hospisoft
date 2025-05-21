// controlador medico
import Medicamentos from "../../models/Medicamentos/medicamentos.js";

export const getAll = async () => {
  try {
    let listaMedicos = await Medicamentos.find().exec();
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

export const avatar = async (data) => {
  const file = data.file;
  const filepath = "./uploads/medicamentos/" + file;
  fs.stat(filepath, (error, exists) => {
    if (!exists) {
      return {
        status: false,
        message: `No existe la imagen: ${error}}`,
      };
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
};
export const add = async (data, file) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  const medicalExist = await Medicamentos.findOne({
    codigo: data.codigo,
  });
  if (medicalExist) {
    return {
      estado: false,
      mensaje: "El Medicamento ya existe en el sistema",
    };
  }
  let image = "";
  if (file) {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      await fs.unlink(file.path);
      return {
        estado: false,
        mensaje: "Extensión de archivo no permitida",
      };
    }
    image = file.filename;
  }
  try {
    const medicalNuevo = new Medicamentos({
      nombre: data.nombre,
      codigo: data.codigo,
      presentacion: data.presentacion,
      descripcion: data.descripcion,
      concentracion: data.concentracion,
      formaFarmaceutica: data.formaFarma,
      viaAdminist: data.administracion,
      uniEnvase: data.envase,
      uniMedida: data.medida,
      stockDisponible: data.stock,
      fechaVencimiento: data.vencimiento,
      imagen: image,
      precioCompra: data.prCompra,
      precioVenta: data.prVenta,
      status: 1,
    });
    await medicalNuevo.save();
    return {
      estado: true,
      mensaje: "Medicamento Registrado exitosamente",
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};
export const updateMedical = async (data) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  let id = data.id;
  let image = "";
  if (file) {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    if (!extensionesValidas.includes(extension)) {
      await fs.unlink(file.path);
      return {
        estado: false,
        mensaje: "Extensión de archivo no permitida",
      };
    }
    image = file.filename;
  }
  let info = {
    nombre: data.nombre,
    codigo: data.codigo,
    presentacion: data.presentacion,
    descripcion: data.descripcion,
    concentracion: data.concentracion,
    formaFarmaceutica: data.formaFarma,
    viaAdminist: data.administracion,
    uniEnvase: data.envase,
    uniMedida: data.medida,
    stockDisponible: data.stock,
    fechaVencimiento: data.vencimiento,
    imagen: image,
    precioCompra: data.prCompra,
    precioVenta: data.prVenta,
  };
  try {
    let medicalUpdate = await Medicamentos.findByIdAndUpdate(id, info);
    return {
      estado: true,
      mensaje: "Actualizacion Exitosa!",
      result: medicalUpdate,
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
    let result = await Medicamentos.findById(id).exec();
    return {
      estado: true,
      mensaje: "Consulta Exitosa",
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
    let result = await Medicamentos.findByIdAndUpdate(id, { status: 0 });
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
