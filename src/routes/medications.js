import express, { json } from "express";
import multer from "multer";
const router = express.Router();
import { getAll, add, updateMedicament, searchById, getList, deleteById } from "../controllers/Medicamentos/medicamentos.js";
import path from "path";
import fs from "fs";
import { celebrate, Joi, errors, Segments } from "celebrate";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "medicamentos");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
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
router.get("/medicaments/image/:file", (req, res) => {
  const { file } = req.params;
  const filepath = path.join(process.cwd(), "uploads", "medicamentos", file);

  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({
        status: false,
        message: `No existe la imagen: ${file}`
      });
    }
    res.sendFile(filepath);
  });
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

router.post(
  "/medicaments/create",
  uploads.single("img"),
  celebrate({
    body: schema
  }),
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
  uploads.single("img"),
  celebrate({
    body: schema
  }),
  async (req, res) => {
    try {
      const { body: data } = req;
      const file = req.file;
      const id = req.params.id;

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
