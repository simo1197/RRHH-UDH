// src/pages/BitacoraPage.jsx
import React from "react";
import MainLayout from "../layouts/MainLayout";
import "./BitacoraPage.css";

const BitacoraPage = () => {
  // Datos de ejemplo, luego se pueden traer del backend
  const eventos = [
    { id: 1, usuario: "Juan Pérez", accion: "Inicio de sesión", fecha: "2025-08-25 08:30" },
    { id: 2, usuario: "María López", accion: "Creó un registro", fecha: "2025-08-25 09:15" },
    { id: 3, usuario: "Carlos Díaz", accion: "Modificó un perfil", fecha: "2025-08-25 10:00" },
  ];

  return (
    <MainLayout>
      <div className="bitacora-page">
        <h1>Bitácora de Eventos</h1>
        <table className="bitacora-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Fecha / Hora</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.usuario}</td>
                <td>{evento.accion}</td>
                <td>{evento.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default BitacoraPage;
