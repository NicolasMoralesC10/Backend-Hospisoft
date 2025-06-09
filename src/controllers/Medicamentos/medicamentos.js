import Medicamentos from "../../models/Medicamentos/medicamentos.js";
// node nativo : fs : filessystem instanciamos para manipular el sistema de archivos del servidor
import fs from "fs";
// modulo nativo de node util para manejar las rutas
import path from "path";

export const getAll = async () => {
  try {
    let listaMedicamentos = await Medicamentos.find({ status: 1 }).exec();
    return {
      estado: true,
      data: listaMedicamentos
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};
export const getList = async () => {
  try {
    let listaMedicamentos = await Medicamentos.find({ status: 1 }).select("nombre _id codigo").exec();
    return {
      estado: true,
      data: listaMedicamentos
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};
export const renderImagen = async (img) => {
  const file = img;
  const filepath = "../../uploads/medicamentos/" + file;
  await fs.stat(filepath, (error, exists) => {
    if (!exists) {
      return {
        status: false,
        message: `No existe la imagen: ${error}}`
      };
    }
    // Devolver un file
    return sendFile(path.resolve(filepath));
  });
};

export const add = async (data, file) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  const medicamentExist = await Medicamentos.findOne({
    codigo: data.codigo
  });
  let image = "";
  if (file) {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      fs.unlink(file.path);
      return {
        estado: false,
        mensaje: "Extensión de archivo no permitida"
      };
    }
    image = file.filename;
  }
  if (medicamentExist) {
    if (file) {
      const imagePath = path.join(file.destination, image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error al eliminar imagen por médicamento exitesnte:", err);
      });
    }
    return {
      estado: false,
      mensaje: "El Medicametno ya existe en el sistema"
    };
  }
  try {
    const medicalNuevo = new Medicamentos({
      nombre: data.nombre,
      codigo: data.codigo,
      presentacion: data.presentacion,
      concentracion: data.concentracion,
      viaAdminist: data.administracion,
      uniMedida: data.medida,
      stockDisponible: data.stock,
      fechaVencimiento: data.vencimiento,
      imagen: image,
      precioCompra: data.prCompra,
      precioVenta: data.prVenta,
      status: 1
    });
    await medicalNuevo.save();
    return {
      estado: true,
      mensaje: "Medicamento Registrado exitosamente"
    };
  } catch (error) {
    if (file) {
      const imagePath = path.join(file.destination, image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error al eliminar la imagen tras fallo:", err);
      });
    }
    return {
      estado: false,
      mensaje: `Error: ${error}`
    };
  }
};

export const updateMedicament = async (data, file, id) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  let image;

  if (file) {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    if (!extensionesValidas.includes(extension)) {
      fs.unlink(file.path, () => {});
      return {
        estado: false,
        mensaje: "Extensión de archivo no permitida"
      };
    }
    image = file.filename;
  } else {
    // Si no hay archivo, obtenemos la imagen anterior
    const anterior = await Medicamentos.findById(id);
    image = anterior?.imagen || ""; // Puede ser "" si no había imagen antes
  }

  let info = {
    nombre: data.nombre,
    codigo: data.codigo,
    presentacion: data.presentacion,
    concentracion: data.concentracion,
    viaAdminist: data.administracion,
    stockDisponible: data.stock,
    fechaVencimiento: data.vencimiento,
    imagen: image,
    precioCompra: data.prCompra,
    precioVenta: data.prVenta
  };

  try {
    let medicalUpdate = await Medicamentos.findByIdAndUpdate(id, info, { new: true });
    return {
      estado: true,
      mensaje: "Actualizacion Exitosa!",
      data: medicalUpdate
    };
  } catch (error) {
    if (file) {
      const imagePath = path.join(file.destination, image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error al eliminar la imagen tras fallo:", err);
      });
    }
    return {
      estado: false,
      mensaje: `Error: ${error}`
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
    let result = await Medicamentos.findByIdAndUpdate(id, { status: 0 });
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
