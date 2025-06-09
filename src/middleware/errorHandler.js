export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.joi) {
    return res.status(400).json({
      estado: false,
      mensaje: "Error de validación",
      detalles: err.joi.details.map((d) => d.message),
    });
  }

  return res.status(500).json({
    estado: false,
    mensaje: "Error interno del servidor",
    detalles: err.message,
  });
};
