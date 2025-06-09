import express, { json } from "express";
import multer from "multer";
const router = express.Router();
import { getAll, add, updateMedicament, searchById, getList, deleteById } from "../controllers/Medicamentos/medicamentos.js";
import path from "path";
import fs from "fs";
import { celebrate, Joi, errors, Segments } from "celebrate";

// configurar un bodega para las imagenes de multer
const storage = multer.diskStorage({
  // ruta de destino para almacenar los archivos
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/medicamentos");
  },
  // estructara para determinar los archivos
  filename: (req, file, cb) => {
    // armamos el nombre del archivo
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const schema = Joi.object({
  nombre: Joi.string().required(),
  codigo: Joi.string().required(),
  presentacion: Joi.string().required(),
  concentracion: Joi.string().required(),
  administracion: Joi.string().required(),
  stock: Joi.number().required(),
  vencimiento: Joi.string().required(),
  prCompra: Joi.number().required(),
  prVenta: Joi.number().required()
});

const uploads = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
router.get("/medicaments/list", async (req, res) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de medicamentos" });
  }
});
router.get("/medicaments/info", async (req, res) => {
  try {
    const response = await getList();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de medicamentos" });
  }
});
router.get("/medicaments/image/:file", async (req, res) => {
  const { file } = req.params;
  try {
    const filepath = path.resolve("./src/uploads/medicamentos", file);

    fs.stat(filepath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({
          status: false,
          message: `No existe la imagen: ${file}`
        });
      }
      // Enviar el archivo como respuesta
      res.sendFile(filepath);
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen" });
  }
});
router.get("/medicaments/:id", async (req, res) => {
  try {
    const data = req.params.id;
    const response = await searchById(data);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la informacion" });
  }
});

// Ruta POST con manejo robusto de errores de Multer
router.post(
  "/medicaments/create",
  (req, res, next) => {
    uploads.single("img")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Error propio de Multer (campo inesperado, tamaño, etc.)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Otro error
        return res.status(500).json({ message: "Error al subir archivo." });
      }
      next();
    });
  },
  celebrate({ body: schema }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No se ha subido ninguna imagen" });
      }
      const response = await add(data, file);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: `Error al Registrar el Medicamento`,
        error: `${error}`
      });
    }
  }
);

router.put(
  "/medicaments/update/:id",
  (req, res, next) => {
    uploads.single("img")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Error al subir archivo." });
      }
      next();
    });
  },
  celebrate({ body: schema }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const file = req.file; // Puede ser undefined si no se subió imagen
      const id = req.params.id;

      // Ya NO rechaces si no hay imagen
      // if (!file) {
      //   return res.status(400).json({ message: "No se ha subido ninguna imagen" });
      // }

      // Tu función updateMedicament debe manejar el caso:
      // Si file es undefined, no cambies la imagen en la base de datos
      const response = await updateMedicament(data, file, id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar" });
    }
  }
);

router.post(
  "/medicaments/delet",
  celebrate({
    body: Joi.object({
      id: Joi.string().required()
    })
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const response = await deleteById(data);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar" });
    }
  }
);

router.use(errors());
export default router;
