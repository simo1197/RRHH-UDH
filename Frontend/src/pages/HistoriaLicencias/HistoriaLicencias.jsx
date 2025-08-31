// src/pages/HistorialLicencias.jsx
import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./HistoriaLicencias.css";

// Datos de ejemplo (puedes reemplazar con datos reales del backend)
const datosEjemplo = [
  {
    id: 1,
    usuario: "Juan Pérez",
    tipo: "Vacaciones",
    inicio: "2025-09-01",
    fin: "2025-09-10",
    motivo: "Viaje familiar",
    estado: "Aprobado",
  },
  {
    id: 2,
    usuario: "Ana Gómez",
    tipo: "Permiso de días",
    inicio: "2025-08-20",
    fin: "2025-08-21",
    motivo: "Asuntos personales",
    estado: "Pendiente",
  },
  {
    id: 3,
    usuario: "Carlos López",
    tipo: "Permiso de horas",
    inicio: "2025-08-25 09:00",
    fin: "2025-08-25 12:00",
    motivo: "Cita médica",
    estado: "Aprobado",
  },
];

export default function HistorialLicencias() {
  const [filtroTipo, setFiltroTipo] = useState("");

  const datosFiltrados = filtroTipo
    ? datosEjemplo.filter((item) => item.tipo === filtroTipo)
    : datosEjemplo;

  return (
    <Layout>
      <div className="historial-container">
        <h2>Historial de Licencias y Permisos</h2>

        <div className="filtros">
          <label>
            Filtrar por tipo:
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Vacaciones">Vacaciones</option>
              <option value="Permiso de días">Permiso de días</option>
              <option value="Permiso de horas">Permiso de horas</option>
            </select>
          </label>
        </div>

        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Motivo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={item.id}>
                <td>{item.usuario}</td>
                <td>{item.tipo}</td>
                <td>{item.inicio}</td>
                <td>{item.fin}</td>
                <td>{item.motivo}</td>
                <td className={`estado ${item.estado.toLowerCase()}`}>
                  {item.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
