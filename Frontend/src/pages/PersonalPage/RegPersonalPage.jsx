import React, { useState } from "react";
import Layout from "../../Layouts/Layout";
import "./RegPersonalPage.css";

const RegPersonalPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cargo: "",
    area: "",
    fechaIngreso: "",
    correo: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos registrados:", formData);
    alert("Personal registrado con éxito");
    setFormData({
      nombre: "",
      apellido: "",
      cargo: "",
      area: "",
      fechaIngreso: "",
      correo: "",
      telefono: "",
    });
  };

  return (
    <Layout userType="admin">
      <div className="regpersonal-page">
        <h1 className="regpersonal-title">👨‍✈️ Registro de Personal</h1>
        <p className="regpersonal-subtitle">
          Complete el formulario para registrar un nuevo miembro del personal.
        </p>

        <form className="regpersonal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingrese el nombre"
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                placeholder="Ingrese el apellido"
              />
            </div>

            <div className="form-group">
              <label>Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
                placeholder="Ej. Capitán, Licenciado"
              />
            </div>

            <div className="form-group">
              <label>Área / Departamento</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Ej. Administración"
              />
            </div>

            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. +504 9999-9999"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">💾 Guardar</button>
            <button type="reset" className="btn-cancelar">❌ Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegPersonalPage;

