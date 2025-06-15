import Patients from "../../models/Paciente/patient.js";
import Medicos from "../../models/Medico/medico.js";
import Cita from "../../models/Cita/cita.js";
import { Types } from "mongoose";
import { getISOWeek, startOfWeek, endOfWeek, addWeeks, format } from "date-fns";

export const pacientesPorDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: { $gte: hace7Dias, $lte: hoy },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
            paciente: "$idPaciente",
          },
        },
      },
      {
        $group: {
          _id: "$_id.day",
          pacientesUnicos: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dataMap = {};
    result.forEach((item) => {
      dataMap[item._id] = item.pacientesUnicos;
    });

    const data = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(hoy);
      day.setDate(hoy.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      data.push(dataMap[dayStr] || 0);
      // Formatear etiqueta como "dd/MM"
      labels.push(day.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }));
    }

    res.json({ data, labels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pacientesPorSemana = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioPeriodo = startOfWeek(addWeeks(hoy, -3), { weekStartsOn: 1 }); // lunes de hace 3 semanas

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: { $gte: inicioPeriodo, $lte: hoy },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            week: { $isoWeek: "$fecha" },
            paciente: "$idPaciente",
          },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", week: "$_id.week" },
          pacientesUnicos: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    const dataMap = {};
    result.forEach((item) => {
      dataMap[`${item._id.year}-${item._id.week}`] = item.pacientesUnicos;
    });

    const data = [];
    const labels = [];

    for (let i = 0; i < 4; i++) {
      const semanaDate = addWeeks(inicioPeriodo, i);
      const year = semanaDate.getFullYear();
      const week = getISOWeek(semanaDate);
      const key = `${year}-${week}`;
      data.push(dataMap[key] || 0);

      // Calcular inicio y fin de semana para la etiqueta
      const inicioSemana = startOfWeek(semanaDate, { weekStartsOn: 1 });
      const finSemana = endOfWeek(semanaDate, { weekStartsOn: 1 });

      // Formatear fechas (ejemplo: "01/06 - 07/06")
      const label = `${format(inicioSemana, "dd/MM")} - ${format(finSemana, "dd/MM")}`;
      labels.push(label);
    }

    res.json({ data, labels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pacientesPorMes = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$fecha" }, paciente: "$idPaciente" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          pacientesUnicos: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = Array(12).fill(0);
    result.forEach((item) => {
      data[item._id - 1] = item.pacientesUnicos;
    });

    // Etiquetas para meses en español
    const labels = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    res.json({ data, labels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* export const pacientesPorAno = async (req, res) => {
  try {
    const yearActual = new Date().getFullYear();
    const inicioAno = new Date(`${yearActual - 4}-01-01T00:00:00Z`);
    const finAno = new Date(`${yearActual + 1}-01-01T00:00:00Z`);

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: { $gte: inicioAno, $lt: finAno },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$fecha" }, paciente: "$idPaciente" },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          pacientesUnicos: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Crear array con pacientes únicos por año para últimos 5 años
    const dataMap = {};
    result.forEach((item) => {
      dataMap[item._id] = item.pacientesUnicos;
    });

    const data = [];
    for (let y = yearActual - 4; y <= yearActual; y++) {
      data.push(dataMap[y] || 0);
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

export const facturacionPorMes = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$fecha" } },
          totalCitas: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = Array(12).fill(0);
    result.forEach((item) => {
      data[item._id.month - 1] = item.totalCitas;
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const citasPorDia = async (req, res) => {
  try {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);

    const result = await Cita.aggregate([
      {
        $match: {
          status: 1,
          fecha: { $gte: hace7Dias, $lte: hoy },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$fecha" }, // 1=Domingo, 2=Lunes, ..., 7=Sábado
          total: { $sum: 1 },
        },
      },
    ]);

    // Mapear resultados a array [Lun, Mar, Mié, Jue, Vie, Sáb, Dom]
    const data = [0, 0, 0, 0, 0, 0, 0];
    result.forEach((item) => {
      // Mongo: 1=Dom, 2=Lun ... Ajustamos índice
      let index = item._id - 2;
      if (index < 0) index = 6;
      data[index] = item.total;
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const nuevosMedicosPorMes = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const result = await Medicos.aggregate([
      {
        $match: {
          status: 1,
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = Array(12).fill(0);
    result.forEach((item) => {
      data[item._id.month - 1] = item.total;
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const totalPacientes = async (req, res) => {
  try {
    const total = await Patients.countDocuments({ status: 1 });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const totalMedicos = async (req, res) => {
  try {
    const total = await Medicos.countDocuments({ status: 1 });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const citasHoy = async (req, res) => {
  try {
    const hoyStr = new Date().toISOString().slice(0, 10);

    const total = await Cita.countDocuments({
      status: 1,
      $expr: {
        $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$fecha" } }, hoyStr],
      },
    });

    console.log("Citas encontradas hoy:", total);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const facturacionMes = async (req, res) => {
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date(inicioMes);
    finMes.setMonth(finMes.getMonth() + 1);
    finMes.setDate(0);
    finMes.setHours(23, 59, 59, 999);

    const totalCitasMes = await Cita.countDocuments({
      status: 1,
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    res.json({ total: totalCitasMes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ultimasCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ status: 1 }) // solo citas activas
      .sort({ fecha: -1 }) // orden descendente por fecha (más recientes primero)
      .limit(10)
      .populate("idPaciente", "nombrePaciente") // asumiendo que tienes referencia a paciente
      .populate("idMedico", "nombre") // referencia a médico
      .lean();

    // Mapear para enviar solo campos necesarios
    const data = citas.map((cita) => ({
      _id: cita._id,
      pacienteNombre: cita.idPaciente?.nombrePaciente || "Desconocido",
      medicoNombre: cita.idMedico?.nombre || "Desconocido",
      fecha: cita.fecha,
      estado: cita.status === 1 ? "Activa" : "Inactiva",
    }));

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const medicosConMasConsultasMes = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const resultados = await Cita.aggregate([
      {
        $match: {
          fecha: { $gte: firstDay, $lte: lastDay },
          // status: 1,  Solo citas activas (ajusta si quieres incluir otras)
        },
      },
      {
        $group: {
          _id: "$idMedico",
          consultas: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "medicos", // nombre exacto de la colección en MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "medico",
        },
      },
      {
        $unwind: "$medico",
      },
      {
        $project: {
          _id: 0,
          name: "$medico.nombre",
          consultas: 1,
        },
      },
      {
        $sort: { consultas: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({ data: resultados });
  } catch (error) {
    console.error("Error en medicosConMasConsultasMes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
