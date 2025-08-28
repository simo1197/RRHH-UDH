import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./BibliotecaPage.css";

const BibliotecaPage = () => {
  // Estado para almacenar documentos cargados
  const [documentos, setDocumentos] = useState([
    { id: 1, nombre: "Reglamento UDH.pdf", tipo: "PDF", fecha: "2025-08-20" },
    { id: 2, nombre: "Plan de Estudios.docx", tipo: "Word", fecha: "2025-08-21" },
  ]);

  // Manejo de carga de documentos (solo demo, luego se conecta al backend)
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const nuevoDoc = {
        id: documentos.length + 1,
        nombre: file.name,
        tipo: file.type.includes("pdf") ? "PDF" : "Otro",
        fecha: new Date().toISOString().split("T")[0],
      };
      setDocumentos([...documentos, nuevoDoc]);
    }
  };

  return (
    <Layout userType="user">
      <div className="biblioteca-page">
        <h1 className="biblioteca-title">📚 Biblioteca Digital</h1>
        <p className="biblioteca-subtitle">
          Aquí puedes cargar y visualizar documentos disponibles.
        </p>

        {/* Botón para cargar documentos */}
        <div className="upload-section">
          <label className="upload-btn">
             Subir documento
            <input type="file" onChange={handleUpload} hidden />
          </label>
        </div>

        {/* Lista de documentos */}
        <div className="documentos-grid">
          {documentos.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">
                {doc.tipo === "PDF" ? "📄" : "📝"}
              </div>
              <div className="document-info">
                <h3>{doc.nombre}</h3>
                <p>Tipo: {doc.tipo}</p>
                <p>Subido: {doc.fecha}</p>
              </div>
              <div className="document-actions">
                <button className="btn-ver">👁 Ver</button>
                <button className="btn-descargar">⬇ Descargar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BibliotecaPage;
