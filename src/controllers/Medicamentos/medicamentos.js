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
      data: listaMedicamentos,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};
export const getList = async () => {
  try {
    let listaMedicamentos = await Medicamentos.find({ status: 1 }).select("nombre _id codigo").exec();
    return {
      estado: true,
      data: listaMedicamentos,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};
export const renderImagen = (img) => {
  return new Promise((resolve, reject) => {
    // Ruta absoluta a la imagen en uploads/medicamentos
    const filepath = path.join(process.cwd(), "uploads", "medicamentos", img);

    fs.stat(filepath, (error, stats) => {
      if (error || !stats.isFile()) {
        return reject(new Error(`No existe la imagen: ${img}`));
      }
      resolve(filepath);
    });
  });
};

export const add = async (data, file) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  const medicamentExist = await Medicamentos.findOne({ codigo: data.codigo });
  let image = "";

  if (file) {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      // Eliminar archivo inválido
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error eliminando archivo inválido:", err);
      });
      return {
        estado: false,
        mensaje: "Extensión de archivo no permitida",
      };
    }
    image = file.filename;
  }

  if (medicamentExist) {
    if (file) {
      // Eliminar imagen subida porque ya existe el medicamento
      const imagePath = path.join(process.cwd(), "uploads", "medicamentos", image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error al eliminar imagen por medicamento existente:", err);
      });
    }
    return {
      estado: false,
      mensaje: "El Medicamento ya existe en el sistema",
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
      status: 1,
    });
    await medicalNuevo.save();

    return {
      estado: true,
      mensaje: "Medicamento Registrado exitosamente",
    };
  } catch (error) {
    if (file) {
      const imagePath = path.join(process.cwd(), "uploads", "medicamentos", image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error al eliminar la imagen tras fallo:", err);
      });
    }
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};

export const updateMedicament = async (data, file, id) => {
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  let image;

  try {
    if (file) {
      const extension = path.extname(file.originalname).slice(1).toLowerCase();
      if (!extensionesValidas.includes(extension)) {
        // Eliminar archivo subido inválido
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error eliminando archivo inválido:", err);
        });
        return {
          estado: false,
          mensaje: "Extensión de archivo no permitida",
        };
      }
      // Si hay archivo nuevo, eliminar imagen anterior si existe
      const medicamentoAnterior = await Medicamentos.findById(id);
      if (medicamentoAnterior && medicamentoAnterior.imagen) {
        const rutaImagenAnterior = path.join(process.cwd(), "uploads", "medicamentos", medicamentoAnterior.imagen);
        if (fs.existsSync(rutaImagenAnterior)) {
          fs.unlink(rutaImagenAnterior, (err) => {
            if (err) console.error("Error eliminando imagen anterior:", err);
          });
        }
      }
      image = file.filename;
    } else {
      // Mantener imagen anterior si no hay archivo nuevo
      const anterior = await Medicamentos.findById(id);
      image = anterior?.imagen || "";
    }

    const info = {
      nombre: data.nombre,
      codigo: data.codigo,
      presentacion: data.presentacion,
      concentracion: data.concentracion,
      viaAdminist: data.administracion,
      stockDisponible: data.stock,
      fechaVencimiento: data.vencimiento,
      imagen: image,
      precioCompra: data.prCompra,
      precioVenta: data.prVenta,
    };

    const medicalUpdate = await Medicamentos.findByIdAndUpdate(id, info, { new: true });

    return {
      estado: true,
      mensaje: "Actualización exitosa!",
      data: medicalUpdate,
    };
  } catch (error) {
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error al eliminar la imagen tras fallo:", err);
      });
    }
    return {
      estado: false,
      mensaje: `Error: ${error.message || error}`,
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
      data: result,
    };
  } catch (error) {
    return {
      estado: false,
      mensaje: `Error: ${error}`,
    };
  }
};
