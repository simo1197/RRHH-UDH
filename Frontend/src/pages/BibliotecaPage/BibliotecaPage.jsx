import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import "./BibliotecaPage.css";

const BibliotecaPage = () => {
  const [folders, setFolders] = useState([]);

  // Cargar folders desde localStorage
  useEffect(() => {
    const savedFolders = localStorage.getItem("bibliotecaFolders");
    if (savedFolders) setFolders(JSON.parse(savedFolders));
  }, []);

  // Guardar folders en localStorage
  useEffect(() => {
    localStorage.setItem("bibliotecaFolders", JSON.stringify(folders));
  }, [folders]);

  // Crear carpeta principal con prompt
  const handleAddFolder = () => {
    const name = prompt("Nombre de la nueva carpeta:");
    if (!name) return;
    const newFolder = {
      id: Date.now(),
      name,
      subfolders: [],
      documents: [],
    };
    setFolders([...folders, newFolder]);
  };

  // Eliminar carpeta principal
  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId));
  };

  // Crear subcarpeta con prompt
  const handleAddSubfolder = (folderId) => {
    const name = prompt("Nombre de la nueva subcarpeta:");
    if (!name) return;
    setFolders(
      folders.map(f => {
        if (f.id === folderId) {
          return {
            ...f,
            subfolders: [...f.subfolders, { id: Date.now(), name, documents: [] }],
          };
        }
        return f;
      })
    );
  };

  // Eliminar subcarpeta
  const handleDeleteSubfolder = (folderId, subId) => {
    setFolders(
      folders.map(f => {
        if (f.id === folderId) {
          return { ...f, subfolders: f.subfolders.filter(s => s.id !== subId) };
        }
        return f;
      })
    );
  };

  // Agregar documento a carpeta o subcarpeta
  const handleAddDocument = (folderId, subId = null, file) => {
    if (!file) return;
    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type.includes("pdf") ? "PDF" : "Otro",
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(file), // Para descarga
    };

    setFolders(
      folders.map(f => {
        if (f.id === folderId) {
          if (subId) {
            return {
              ...f,
              subfolders: f.subfolders.map(s => {
                if (s.id === subId) {
                  return { ...s, documents: [...s.documents, newDoc] };
                }
                return s;
              }),
            };
          } else {
            return { ...f, documents: [...f.documents, newDoc] };
          }
        }
        return f;
      })
    );
  };

  // Eliminar documento
  const handleDeleteDocument = (folderId, docId, subId = null) => {
    setFolders(
      folders.map(f => {
        if (f.id === folderId) {
          if (subId) {
            return {
              ...f,
              subfolders: f.subfolders.map(s => {
                if (s.id === subId) {
                  return { ...s, documents: s.documents.filter(d => d.id !== docId) };
                }
                return s;
              }),
            };
          } else {
            return { ...f, documents: f.documents.filter(d => d.id !== docId) };
          }
        }
        return f;
      })
    );
  };

  return (
    <Layout userType="user">
      <div className="biblioteca-page">
        <h1 className="biblioteca-title">📚 Biblioteca Digital</h1>
        <button className="btn-new-folder" onClick={handleAddFolder}>Nueva Carpeta</button>

        <div className="folders-grid">
          {folders.map(folder => (
            <div key={folder.id} className="folder-card">
              <div className="folder-header">
                <span className="folder-icon">📁</span>
                <span className="folder-name">{folder.name}</span>
                <button className="btn-delete" onClick={() => handleDeleteFolder(folder.id)}>✖</button>
              </div>

              {/* Documentos en carpeta principal */}
              <div className="documents-section">
                {folder.documents.map(doc => (
                  <div key={doc.id} className="document-card">
                    <span className="document-icon">{doc.type === "PDF" ? "📄" : "📝"}</span>
                    <span>{doc.name}</span>
                    <a className="btn-download" href={doc.url} download={doc.name}>⬇</a>
                    <button className="btn-delete" onClick={() => handleDeleteDocument(folder.id, doc.id)}>✖</button>
                  </div>
                ))}
              </div>

              {/* Subcarpetas */}
              <div className="subfolder-section">
                {folder.subfolders.map(sub => (
                  <div key={sub.id} className="subfolder-card">
                    <div className="subfolder-header">
                      <span className="folder-icon">📂</span>
                      <span className="folder-name">{sub.name}</span>
                      <button className="btn-delete" onClick={() => handleDeleteSubfolder(folder.id, sub.id)}>✖</button>
                    </div>

                    {/* Documentos dentro de subcarpeta */}
                    <div className="documents-section">
                      {sub.documents.map(doc => (
                        <div key={doc.id} className="document-card">
                          <span className="document-icon">{doc.type === "PDF" ? "📄" : "📝"}</span>
                          <span>{doc.name}</span>
                          <a className="btn-download" href={doc.url} download={doc.name}>⬇</a>
                          <button className="btn-delete" onClick={() => handleDeleteDocument(folder.id, doc.id, sub.id)}>✖</button>
                        </div>
                      ))}
                      <label className="upload-subfolder">
                        Subir documento
                        <input
                          type="file"
                          onChange={e => handleAddDocument(folder.id, sub.id, e.target.files[0])}
                          hidden
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Añadir subcarpeta */}
              <button className="btn-add-subfolder" onClick={() => handleAddSubfolder(folder.id)}>Nueva Subcarpeta</button>

              {/* Subir documento a carpeta principal */}
              <label className="upload-main-folder">
                Subir documento
                <input
                  type="file"
                  onChange={e => handleAddDocument(folder.id, null, e.target.files[0])}
                  hidden
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BibliotecaPage;








