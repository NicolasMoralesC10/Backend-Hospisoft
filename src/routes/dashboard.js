import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  totalPacientes,
  totalMedicos,
  citasHoy,
  facturacionMes,
  pacientesPorDia,
  pacientesPorSemana,
  pacientesPorMes,
  facturacionPorMes,
  citasPorDia,
  nuevosMedicosPorMes,
  ultimasCitas,
  medicosConMasConsultasMes,
} from "../controllers/Dashboard/dashboard.js";

const router = express.Router();

// Total pacientes activos
router.get(
  "/total-pacientes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await totalPacientes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Total médicos activos
router.get("/total-medicos", celebrate({ [Segments.QUERY]: Joi.object({}) }), async (req, res) => {
  try {
    await totalMedicos(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Citas agendadas hoy
router.get("/citas-hoy", celebrate({ [Segments.QUERY]: Joi.object({}) }), async (req, res) => {
  try {
    await citasHoy(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Facturación (proxy: total citas activas) del mes
router.get(
  "/facturacion-mes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await facturacionMes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Pacientes atendidos por día (últimos 7 días)
router.get(
  "/pacientes-por-dia",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await pacientesPorDia(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Pacientes atendidos por semana
router.get(
  "/pacientes-por-semana",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await pacientesPorSemana(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Pacientes atendidos por mes (para gráfica)
router.get(
  "/pacientes-por-mes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await pacientesPorMes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Pacientes atendidos por año (últimos años)
router.get(
  "/pacientes-por-ano",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await pacientesPorAno(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Facturación por mes (proxy para gráfica)
router.get(
  "/facturacion-por-mes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await facturacionPorMes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Citas por día de la semana (para gráfica)
router.get("/citas-por-dia", celebrate({ [Segments.QUERY]: Joi.object({}) }), async (req, res) => {
  try {
    await citasPorDia(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Nuevos médicos por mes (para gráfica)
router.get(
  "/nuevos-medicos-por-mes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await nuevosMedicosPorMes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Ultimas citas agendadas
router.get("/ultimas-citas", celebrate({ [Segments.QUERY]: Joi.object({}) }), async (req, res) => {
  try {
    await ultimasCitas(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Medicos con mas consultas en el mes
router.get(
  "/medicos-mas-consultas-mes",
  celebrate({ [Segments.QUERY]: Joi.object({}) }),
  async (req, res) => {
    try {
      await medicosConMasConsultasMes(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
