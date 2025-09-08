import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import "./EvaluateHistoryPage.css";

// Estructura de ejemplo de áreas por dirección
const structure = {
  "Rectoría": ["Vinculación", "Calidad Educativa"],
  "Vicerrectoría Académica": ["Posgrado", "Estudios de Grado", "Educación Continua", "Servicios Estudiantiles", "Educación a Distancia", "Docencia"],
  "Vicerrectoría Administrativa": ["Finanzas", "Talento Humano", "Gestión Tecnológica", "Logística"],
  "Secretaría General": ["Secretaría General"],
  "II+D+I": ["II+D+I"]
};

// Miembros de ejemplo por área
const sampleMembers = {
  "Vinculación": ["Juan Pérez", "María López"],
  "Calidad Educativa": ["Carlos Díaz", "Ana Gómez"],
  "Posgrado": ["Luis Torres", "Sofía Ramírez"],
  "Estudios de Grado": ["Pedro Martínez", "Lucía Fernández"],
  "Educación Continua": ["Marta Castro"],
  "Servicios Estudiantiles": ["David Herrera"],
  "Educación a Distancia": ["Laura Moreno"],
  "Docencia": ["José Cruz"],
  "Finanzas": ["Karen López"],
  "Talento Humano": ["Miguel Rodríguez"],
  "Gestión Tecnológica": ["Camila Sánchez"],
  "Logística": ["Raúl Ortega"],
  "Secretaría General": ["Secretaria1", "Secretaria2"],
  "II+D+I": ["Investigador1"]
};

// Ejemplo de evaluaciones históricas
const sampleEvaluations = [
  {
    member: "Juan Pérez",
    direction: "Rectoría",
    area: "Vinculación",
    date: "2025-09-01",
    score: 8
  },
  {
    member: "María López",
    direction: "Rectoría",
    area: "Vinculación",
    date: "2025-09-02",
    score: 7
  },
  {
    member: "Luis Torres",
    direction: "Vicerrectoría Académica",
    area: "Posgrado",
    date: "2025-09-03",
    score: 9
  },
  {
    member: "Marta Castro",
    direction: "Vicerrectoría Académica",
    area: "Educación Continua",
    date: "2025-09-04",
    score: 6
  }
];

const EvaluateHistoryPage = () => {
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);

  useEffect(() => {
    let filtered = sampleEvaluations;
    if (selectedDirection) {
      filtered = filtered.filter(e => e.direction === selectedDirection);
    }
    if (selectedArea) {
      filtered = filtered.filter(e => e.area === selectedArea);
    }
    setFilteredEvaluations(filtered);
  }, [selectedDirection, selectedArea]);

  const getScoreClass = score => {
    if (score >= 8) return "good";
    if (score >= 5) return "medium";
    return "bad";
  };

  return (
    <Layout userType="admin">
      <div className="history-page">
        <h1 className="history-title">📊 Historial de Evaluaciones</h1>
        <p className="history-subtitle">Visualice todas las evaluaciones históricas de los miembros de la UDH.</p>

        {/* --- Selector Dirección --- */}
        <div className="selector-container">
          <label>Dirección:</label>
          <select
            value={selectedDirection}
            onChange={e => {
              setSelectedDirection(e.target.value);
              setSelectedArea("");
            }}
          >
            <option value="">Todas las Direcciones</option>
            {Object.keys(structure).map(dir => (
              <option key={dir} value={dir}>{dir}</option>
            ))}
          </select>
        </div>

        {/* --- Selector Área --- */}
        {selectedDirection && (
          <div className="selector-container">
            <label>Área:</label>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
            >
              <option value="">Todas las Áreas</option>
              {structure[selectedDirection].map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        )}

        {/* --- Tabla de evaluaciones --- */}
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Dirección</th>
                <th>Área</th>
                <th>Fecha</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evalItem, idx) => (
                  <tr key={idx}>
                    <td>{evalItem.member}</td>
                    <td>{evalItem.direction}</td>
                    <td>{evalItem.area}</td>
                    <td>{evalItem.date}</td>
                    <td>
                      <span className={`score-value ${getScoreClass(evalItem.score)}`}>
                        {evalItem.score}/10
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: "center", fontWeight: "bold"}}>
                    No hay evaluaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EvaluateHistoryPage;
