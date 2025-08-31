// src/pages/PendientesAprobacion.jsx
import React from "react";
import Layout from "../../Layouts/Layout";
import "./PendientesAprobacion.css";

// Datos de ejemplo (reemplazar con datos reales del backend)
const datosPendientes = [
  {
    id: 1,
    usuario: "Ana Gómez",
    tipo: "Permiso de días",
    inicio: "2025-09-05",
    fin: "2025-09-07",
    motivo: "Asuntos personales",
    estado: "Pendiente",
  },
  {
    id: 2,
    usuario: "Carlos López",
    tipo: "Permiso de horas",
    inicio: "2025-09-10 08:00",
    fin: "2025-09-10 11:00",
    motivo: "Cita médica",
    estado: "Pendiente",
  },
];

export default function PendientesAprobacion() {
  return (
    <Layout>
      <div className="pendientes-container">
        <h2>Solicitudes Pendientes de Aprobación</h2>

        {datosPendientes.length === 0 ? (
          <p className="no-pendientes">No hay solicitudes pendientes.</p>
        ) : (
          <table className="tabla-pendientes">
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
              {datosPendientes.map((item) => (
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
        )}
      </div>
    </Layout>
  );
}
