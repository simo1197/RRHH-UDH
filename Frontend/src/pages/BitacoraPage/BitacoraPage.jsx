// src/pages/BitacoraPage.jsx
import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./BitacoraPage.css";

const BitacoraPage = () => {
  // Datos de ejemplo
  const eventos = [
    { id: 1, usuario: "Juan Pérez", accion: "Inicio de sesión", fecha: "2025-08-25 08:30" },
    { id: 2, usuario: "María López", accion: "Creó un registro", fecha: "2025-08-25 09:15" },
    { id: 3, usuario: "Carlos Díaz", accion: "Modificó un perfil", fecha: "2025-08-25 10:00" },
  ];

  const [filtroUsuario, setFiltroUsuario] = useState("");

  // Función para normalizar texto (ignorar acentos y mayúsculas)
  const normalizar = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filtrar eventos por usuario
  const eventosFiltrados = eventos.filter(evento =>
    normalizar(evento.usuario).includes(normalizar(filtroUsuario))
  );

  return (
    <Layout userType="user">
      <div className="bitacora-page">
        <h1>Bitácora de Eventos</h1>

        <div className="filter-container">
          <label htmlFor="filtroUsuario">Filtrar por usuario:</label>
          <input
            type="text"
            id="filtroUsuario"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            placeholder="Ingrese nombre del usuario"
          />
        </div>

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
            {eventosFiltrados.map((evento) => (
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
    </Layout>
  );
};

export default BitacoraPage;



