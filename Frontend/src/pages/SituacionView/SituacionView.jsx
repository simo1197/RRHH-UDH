// src/pages/SituacionView.jsx
import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./SituacionView.css";

const columnas = [
  "Situación",
  "Rector",
  "Cnel",
  "Tte Cnel",
  "Mayor",
  "Cap/Tnav",
  "Tte.-T/F",
  "Stte.-A/F",
  "Total de Oficiales",
  "Sub oficiales",
  "Tropa",
  "Personal Auxiliar",
  "Total",
];

const SituacionView = () => {
  const [filas, setFilas] = useState(
    Array(10).fill(Array(columnas.length).fill(""))
  );

  // Manejar cambios en celdas
  const handleChange = (rowIndex, colIndex, value) => {
    const nuevasFilas = [...filas];
    nuevasFilas[rowIndex] = [...nuevasFilas[rowIndex]];
    nuevasFilas[rowIndex][colIndex] = value;
    setFilas(nuevasFilas);
  };

  // Calcular totales por columna
  const calcularTotales = (colIndex) => {
    if (colIndex === 0) return "Total";
    return filas.reduce((acc, fila) => {
      const val = fila[colIndex];
      return acc + (isNaN(Number(val)) ? 0 : Number(val));
    }, 0);
  };

  return (
    <Layout userType="admin">
      <div className="situacion-page">
        <h1>📊 Situación de Personal</h1>
        <div className="tabla-wrapper">
          <table className="situacion-table">
            <thead>
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  {fila.map((celda, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={celda}
                        onChange={(e) =>
                          handleChange(rowIndex, colIndex, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Totales */}
              <tr className="totales-row">
                {columnas.map((_, colIndex) => (
                  <td key={colIndex}>{calcularTotales(colIndex)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SituacionView;

