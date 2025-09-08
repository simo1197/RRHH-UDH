import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import "./EvaluatePage.css";

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

// Ejemplo de competencias y aspectos
const competenciesData = [
  {
    title: "Resolución de Problemas",
    aspects: [
      "Propone soluciones efectivas",
      "Maneja bien situaciones difíciles",
      "Toma decisiones oportunas",
      "Analiza causas y consecuencias"
    ]
  },
  {
    title: "Comunicación",
    aspects: [
      "Se expresa claramente",
      "Escucha activamente",
      "Adapta su comunicación según la audiencia",
      "Facilita la comprensión en reuniones"
    ]
  },
  {
    title: "Trabajo en Equipo",
    aspects: [
      "Colabora activamente",
      "Comparte información útil",
      "Apoya a compañeros",
      "Contribuye al logro de objetivos comunes"
    ]
  },
  {
    title: "Liderazgo",
    aspects: [
      "Motiva al equipo",
      "Distribuye tareas eficientemente",
      "Gestiona conflictos",
      "Fomenta la participación"
    ]
  }
];

const EvaluatePage = () => {
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Limpieza de estados al cambiar dirección/área/miembro
  useEffect(() => {
    setRatings({});
    setSubmitted(false);
  }, [selectedDirection, selectedArea, selectedMember]);

  const handleRating = (competency, aspect, value) => {
    setRatings(prev => ({
      ...prev,
      [competency]: {
        ...prev[competency],
        [aspect]: value
      }
    }));
  };

  const calculateScore = () => {
    let total = 0;
    let count = 0;
    Object.values(ratings).forEach(aspects => {
      Object.values(aspects).forEach(val => {
        total += val;
        count += 1;
      });
    });
    if (count === 0) return 0;
    return Math.round(total / count);
  };

  const getScoreClass = score => {
    if (score >= 8) return "good";
    if (score >= 5) return "medium";
    return "bad";
  };

  return (
    <Layout userType="admin">
      <div className="evaluate-page">
        <h1 className="evaluate-title">📋 Evaluación 360°</h1>
        <p className="evaluate-subtitle">Seleccione un miembro para evaluar según su Dirección y Área.</p>

        {/* --- Selector Dirección --- */}
        <div className="selector-container">
          <label>Dirección:</label>
          <select
            value={selectedDirection}
            onChange={e => {
              setSelectedDirection(e.target.value);
              setSelectedArea("");
              setSelectedMember("");
            }}
          >
            <option value="">Seleccione Dirección</option>
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
              onChange={e => {
                setSelectedArea(e.target.value);
                setSelectedMember("");
              }}
            >
              <option value="">Seleccione Área</option>
              {structure[selectedDirection].map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        )}

        {/* --- Selector Miembro --- */}
        {selectedArea && (
          <div className="selector-container">
            <label>Miembro UDH:</label>
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
            >
              <option value="">Seleccione Miembro</option>
              {sampleMembers[selectedArea]?.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {/* --- Evaluación --- */}
        {selectedMember && (
          <div className="evaluation-card">
            <h2>Evaluando: {selectedMember}</h2>
            <p className="small-meta">{selectedDirection} - {selectedArea}</p>

            <div className="competencies">
              {competenciesData.map(comp => (
                <div key={comp.title} className="competency">
                  <h4>{comp.title}</h4>
                  <div className="competency-grid">
                    {comp.aspects.map(aspect => (
                      <div key={aspect} className="eval-item">
                        <span className="eval-item-text">{aspect}</span>
                        <div className="rating-controls">
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <label
                              key={num}
                              className={`rating-chip ${ratings[comp.title]?.[aspect] === num ? "active" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`${comp.title}-${aspect}`}
                                value={num}
                                onChange={() => handleRating(comp.title, aspect, num)}
                              />
                              {num}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="competency-comment">
                    <textarea placeholder="Comentarios adicionales..."></textarea>
                  </div>
                </div>
              ))}
            </div>

            <div className="evaluation-actions">
              <button className="btn btn-primary" onClick={() => setSubmitted(true)}>Calcular Resultado</button>
            </div>

            {submitted && (
              <div className="final-score">
                <h3>Resultado Final:</h3>
                <p>
                  Puntuación:{" "}
                  <span className={`score-value ${getScoreClass(calculateScore())}`}>
                    {calculateScore()}/10
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EvaluatePage;


