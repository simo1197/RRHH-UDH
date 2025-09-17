import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./SituacionesPage.css";

const SituacionesPage = () => {
  // Situaciones iniciales
  const [situaciones, setSituaciones] = useState([
    "Licencia",
    "Permiso especial",
    "Reposo",
    "Misión país",
    "Curso",
  ]);

  // Personal de ejemplo
  const [personal, setPersonal] = useState([
    { id: 1, nombre: "Juan Pérez", situacion: "" },
    { id: 2, nombre: "María López", situacion: "" },
    { id: 3, nombre: "Carlos Gómez", situacion: "" },
    { id: 4, nombre: "Ana Torres", situacion: "" },
  ]);

  const [nuevaSituacion, setNuevaSituacion] = useState("");

  // Agregar una nueva situación
  const agregarSituacion = () => {
    const nombre = nuevaSituacion.trim();
    if (nombre && !situaciones.includes(nombre)) {
      setSituaciones([...situaciones, nombre]);
      setNuevaSituacion("");
    }
  };

  // Eliminar una situación
  const eliminarSituacion = (nombre) => {
    setSituaciones(situaciones.filter((s) => s !== nombre));
    // Quitar esa situación a quien la tenga
    setPersonal(
      personal.map((p) =>
        p.situacion === nombre ? { ...p, situacion: "" } : p
      )
    );
  };

  // Cambiar situación a una persona
  const cambiarSituacion = (id, valor) => {
    setPersonal(
      personal.map((p) =>
        p.id === id ? { ...p, situacion: valor } : p
      )
    );
  };

  // Reiniciar todas las situaciones a "Seleccionar"
  const limpiarSituaciones = () => {
    setPersonal(personal.map((p) => ({ ...p, situacion: "" })));
  };

  return (
    <Layout userType="admin">
      <div className="situaciones-page">
        <h1 className="titulo">📋 Listado de Personal y Situaciones</h1>

        {/* Panel de gestión de situaciones */}
        <div className="gestion-situaciones">
          <h2 className="subtitulo">Gestionar Situaciones</h2>
          <div className="nueva-situacion">
            <input
              type="text"
              placeholder="Nueva situación"
              value={nuevaSituacion}
              onChange={(e) => setNuevaSituacion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregarSituacion()}
            />
            <button className="btn-agregar" onClick={agregarSituacion}>
              Agregar
            </button>
            <button className="btn-limpiar" onClick={limpiarSituaciones}>
              Limpiar
            </button>
          </div>
          <ul className="lista-situaciones">
            {situaciones.map((s) => (
              <li key={s} className="item-situacion">
                {s}
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarSituacion(s)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tabla de personal */}
        <div className="tabla-wrapper">
          <table className="tabla-personal">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Situación</th>
              </tr>
            </thead>
            <tbody>
              {personal.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>
                    <select
                      value={p.situacion}
                      onChange={(e) => cambiarSituacion(p.id, e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      {situaciones.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SituacionesPage;
