// src/pages/SolicitudCompleta.jsx
import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./SolicitudView.css";

export default function SolicitudCompleta() {
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const solicitud = {
      tipo,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      motivo,
    };
    console.log("Solicitud enviada:", solicitud);
    alert("¡Solicitud enviada correctamente!");
    setTipo("");
    setFechaInicio("");
    setFechaFin("");
    setHoraInicio("");
    setHoraFin("");
    setMotivo("");
  };

  return (
    <Layout>
      <div className="solicitud-completa-container">
        <h2>Solicitud de Vacaciones / Permisos</h2>
        <form className="solicitud-completa-form" onSubmit={handleSubmit}>
          {/* Tipo de solicitud */}
          <label>
            Tipo de solicitud:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
              <option value="">Seleccione...</option>
              <option value="vacaciones">Vacaciones</option>
              <option value="permiso_dias">Permiso de días</option>
              <option value="permiso_horas">Permiso de horas</option>
            </select>
          </label>

          {/* Fecha / Rango */}
          {(tipo === "vacaciones" || tipo === "permiso_dias") && (
            <>
              <label>
                Fecha de inicio:
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </label>

              <label>
                Fecha de fin:
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {tipo === "permiso_horas" && (
            <>
              <label>
                Fecha:
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </label>

              <div className="hora-rango">
                <label>
                  Hora inicio:
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Hora fin:
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {/* Motivo */}
          <label>
            Motivo / Comentarios:
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe el motivo de tu solicitud..."
              rows={4}
              required
            />
          </label>

          {/* Resumen de la solicitud */}
          <div className="resumen-solicitud">
            <h3>Resumen:</h3>
            <p><strong>Tipo:</strong> {tipo || "N/A"}</p>
            {(tipo === "vacaciones" || tipo === "permiso_dias") && (
              <p>
                <strong>Fechas:</strong> {fechaInicio || "N/A"} – {fechaFin || "N/A"}
              </p>
            )}
            {tipo === "permiso_horas" && (
              <p>
                <strong>Hora:</strong> {horaInicio || "N/A"} – {horaFin || "N/A"} 
                el {fechaInicio || "N/A"}
              </p>
            )}
            <p><strong>Motivo:</strong> {motivo || "N/A"}</p>
          </div>

          <button type="submit" className="boton-enviar">
            Enviar Solicitud
          </button>
        </form>
      </div>
    </Layout>
  );
}
