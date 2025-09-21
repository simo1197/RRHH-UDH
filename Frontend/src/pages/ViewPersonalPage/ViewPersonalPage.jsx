import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./ViewPersonalPage.css";

const ViewPersonalPage = () => {
  // Datos simulados (luego vendrán del backend)
  const [personal] = useState([
    { id: 1, nombre: "Juan", apellido: "Pérez", cargo: "Capitán", area: "Logística", fechaIngreso: "2022-05-10", correo: "juan.perez@udh.edu", telefono: "+504 9999-1111" },
    { id: 2, nombre: "María", apellido: "López", cargo: "Licenciada", area: "Administración", fechaIngreso: "2023-01-15", correo: "maria.lopez@udh.edu", telefono: "+504 9999-2222" },
    { id: 3, nombre: "Carlos", apellido: "Díaz", cargo: "Subteniente", area: "Seguridad", fechaIngreso: "2024-07-01", correo: "carlos.diaz@udh.edu", telefono: "+504 9999-3333" },
  ]);

  return (
    <Layout userType="admin">
      <div className="viewpersonal-page">
        <h1 className="viewpersonal-title">📋 Personal Registrado</h1>
        <p className="viewpersonal-subtitle">
          Visualice el listado del personal registrado en el sistema.
        </p>

        <div className="table-container">
          <table className="personal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Cargo</th>
                <th>Área</th>
                <th>Fecha de Ingreso</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personal.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre} {p.apellido}</td>
                  <td>{p.cargo}</td>
                  <td>{p.area}</td>
                  <td>{p.fechaIngreso}</td>
                  <td>{p.correo}</td>
                  <td>{p.telefono}</td>
                  <td className="acciones">
                    <button className="btn-ver">👁</button>
                    <button className="btn-editar">✏</button>
                    <button className="btn-eliminar">🗑</button>
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

export default ViewPersonalPage;




