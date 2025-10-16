// RegPersonalPage.jsx
// Componente React para registrar personal con selects dependientes y subida de archivo (hoja_vida).


import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../Layouts/Layout";
import "./RegPersonalPage.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

const emptyForm = {
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  dni: "",
  rtn: "",
  cuenta_bancaria: "",
  telefono: "",
  email: "",
  tipo_sangre: "",
  serie: "",
  id_fuerza: "",
  id_rango: "",
  id_grado: "",
  id_categoria: "",
  id_arma: "",
  id_area: "",
  id_direccion: "",
  id_cargo: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  estado: 1,
};

const RegPersonalPage = () => {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);

  const [fuerzas, setFuerzas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [armas, setArmas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [roles, setRoles] = useState([]);

  const [availableRangos, setAvailableRangos] = useState([]);
  const [availableGrados, setAvailableGrados] = useState([]);
  const [availableCategorias, setAvailableCategorias] = useState([]);
  const [availableArmas, setAvailableArmas] = useState([]);
  const [availableDirecciones, setAvailableDirecciones] = useState([]);
  const [availableCargos, setAvailableCargos] = useState([]);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userData, setUserData] = useState({ usuario: "", clave: "", id_rol: "" });

  const fetchJSON = useCallback(async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn("fetch failed", url, res.status);
        return null;
      }
      const json = await res.json();
      if (Array.isArray(json)) return json;
      if (json && Array.isArray(json.data)) return json.data;
      if (json && Array.isArray(json.items)) return json.items;
      if (json && json.id && json.nombre) return [json];
      return json;
    } catch (err) {
      console.error("fetchJSON error:", url, err);
      return null;
    }
  }, []);

  const refreshAll = useCallback(async () => {
    const [
      fRes, rRes, gRes, cRes, aRes, areasRes, dirsRes, cargosRes, rolesRes,
    ] = await Promise.all([
      fetchJSON(`${API_BASE}/fuerzas`),
      fetchJSON(`${API_BASE}/rangos`),
      fetchJSON(`${API_BASE}/grados`),
      fetchJSON(`${API_BASE}/categorias`),
      fetchJSON(`${API_BASE}/armas`),
      fetchJSON(`${API_BASE}/areas`),
      fetchJSON(`${API_BASE}/direcciones`),
      fetchJSON(`${API_BASE}/cargos`),
      fetchJSON(`${API_BASE}/roles`),
    ]);

    if (Array.isArray(fRes)) setFuerzas(fRes);
    if (Array.isArray(rRes)) setRangos(rRes);
    if (Array.isArray(gRes)) setGrados(gRes);
    if (Array.isArray(cRes)) setCategorias(cRes);
    if (Array.isArray(aRes)) setArmas(aRes);
    if (Array.isArray(areasRes)) setAreas(areasRes);
    if (Array.isArray(dirsRes)) setDirecciones(dirsRes);
    if (Array.isArray(cargosRes)) setCargos(cargosRes);
    if (Array.isArray(rolesRes)) setRoles(rolesRes);
  }, [fetchJSON]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!formData.id_fuerza) {
      setAvailableRangos(rangos || []);
    } else {
      const rangoIds = new Set((grados || []).filter(g => String(g.id_fuerza) === String(formData.id_fuerza)).map(g => String(g.id_rango)));
      const derivedR = (rangos || []).filter(r => rangoIds.has(String(r.id)));
      setAvailableRangos(derivedR.length ? derivedR : rangos || []);
    }

    if (formData.id_fuerza && formData.id_rango) {
      setAvailableGrados((grados || []).filter(gr => String(gr.id_fuerza) === String(formData.id_fuerza) && String(gr.id_rango) === String(formData.id_rango)));
    } else if (formData.id_fuerza) {
      setAvailableGrados((grados || []).filter(gr => String(gr.id_fuerza) === String(formData.id_fuerza)));
    } else {
      setAvailableGrados(grados || []);
    }

    if (formData.id_fuerza) {
      const catIds = new Set((armas || []).filter(a => String(a.id_fuerza) === String(formData.id_fuerza)).map(a => String(a.id_categoria)));
      const derivedCats = (categorias || []).filter(c => catIds.has(String(c.id)));
      setAvailableCategorias(derivedCats.length ? derivedCats : categorias || []);
    } else {
      setAvailableCategorias(categorias || []);
    }

    if (formData.id_fuerza && formData.id_categoria) {
      setAvailableArmas((armas || []).filter(a => String(a.id_fuerza) === String(formData.id_fuerza) && String(a.id_categoria) === String(formData.id_categoria)));
    } else if (formData.id_fuerza) {
      setAvailableArmas((armas || []).filter(a => String(a.id_fuerza) === String(formData.id_fuerza)));
    } else {
      setAvailableArmas(armas || []);
    }

    if (formData.id_area) {
      setAvailableDirecciones((direcciones || []).filter(d => String(d.id_area) === String(formData.id_area)));
    } else {
      setAvailableDirecciones(direcciones || []);
    }

    if (formData.id_area && formData.id_direccion) {
      setAvailableCargos((cargos || []).filter(cg => String(cg.id_area) === String(formData.id_area) && (cg.id_direccion === null || String(cg.id_direccion) === String(formData.id_direccion))));
    } else if (formData.id_area) {
      setAvailableCargos((cargos || []).filter(cg => String(cg.id_area) === String(formData.id_area)));
    } else {
      setAvailableCargos(cargos || []);
    }
  }, [formData.id_fuerza, formData.id_rango, formData.id_grado, formData.id_categoria, formData.id_area, formData.id_direccion, fuerzas, rangos, grados, categorias, armas, areas, direcciones, cargos]);

  const fetchOptionsOnFocus = async (type) => {
    try {
      switch (type) {
        case "direcciones": {
          let res = await fetchJSON(`${API_BASE}/direcciones?areaId=${formData.id_area || ""}`);
          if (!res) res = await fetchJSON(`${API_BASE}/direcciones`);
          if (Array.isArray(res)) setDirecciones(res);
          break;
        }
        case "cargos": {
          let res = await fetchJSON(`${API_BASE}/cargos?areaId=${formData.id_area || ""}&direccionId=${formData.id_direccion || ""}`);
          if (!res) res = await fetchJSON(`${API_BASE}/cargos`);
          if (Array.isArray(res)) setCargos(res);
          break;
        }
        case "fuerzas": {
          const res = await fetchJSON(`${API_BASE}/fuerzas`);
          if (Array.isArray(res)) setFuerzas(res);
          break;
        }
        case "rangos": {
          const res = await fetchJSON(`${API_BASE}/rangos`);
          if (Array.isArray(res)) setRangos(res);
          break;
        }
        case "grados": {
          const res = await fetchJSON(`${API_BASE}/grados`);
          if (Array.isArray(res)) setGrados(res);
          break;
        }
        case "categorias": {
          const res = await fetchJSON(`${API_BASE}/categorias`);
          if (Array.isArray(res)) setCategorias(res);
          break;
        }
        case "armas": {
          const res = await fetchJSON(`${API_BASE}/armas`);
          if (Array.isArray(res)) setArmas(res);
          break;
        }
        case "areas": {
          const res = await fetchJSON(`${API_BASE}/areas`);
          if (Array.isArray(res)) setAreas(res);
          break;
        }
        case "roles": {
          const res = await fetchJSON(`${API_BASE}/roles`);
          if (Array.isArray(res)) setRoles(res);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error("fetchOptionsOnFocus error", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newState = { ...formData };

    if (name === "hoja_vida" && files) {
      const f = files[0];
      if (f) {
        setFileToUpload(f);
        newState.hoja_vida = f.name;
      } else {
        setFileToUpload(null);
        newState.hoja_vida = "";
      }
    } else {
      newState[name] = value;
    }

    if (name === "id_fuerza") {
      newState.id_rango = "";
      newState.id_grado = "";
      newState.id_categoria = "";
      newState.id_arma = "";
    }
    if (name === "id_rango") {
      newState.id_grado = "";
    }
    if (name === "id_grado") {
      newState.id_categoria = "";
      newState.id_arma = "";
    }
    if (name === "id_categoria") {
      newState.id_arma = "";
    }
    if (name === "id_area") {
      newState.id_direccion = "";
      newState.id_cargo = "";
      fetchOptionsOnFocus("direcciones");
      fetchOptionsOnFocus("cargos");
    }
    if (name === "id_direccion") {
      newState.id_cargo = "";
      fetchOptionsOnFocus("cargos");
    }

    setFormData(newState);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData(s => ({ ...s, [name]: value }));
  };

  const isSerieEnabled = () => {
    if (!formData.id_rango) return false;
    const sel = (rangos || []).find(r => String(r.id) === String(formData.id_rango));
    return sel && String(sel.nombre).toLowerCase() === "oficial";
  };

  const uploadHojaVida = async (personalId) => {
    if (!fileToUpload) return { ok: true };

    setUploadingFile(true);
    setUploadProgress(0);

    const tryUpload = async (url, form) => {
      try {
        const resp = await fetch(url, {
          method: "POST",
          body: form,
        });
        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          throw new Error(`Upload error ${resp.status} ${txt}`);
        }
        return { ok: true };
      } catch (err) {
        console.warn("upload try failed", url, err);
        return { ok: false, error: err };
      }
    };

    const form = new FormData();
    form.append("hoja_vida", fileToUpload);
    form.append("id_personal", personalId);

    let res = await tryUpload(`${API_BASE}/personal/${personalId}/upload`, form);
    if (res.ok) {
      setUploadingFile(false);
      setUploadProgress(100);
      return { ok: true };
    }

    res = await tryUpload(`${API_BASE}/personal/upload`, form);
    setUploadingFile(false);
    if (res.ok) {
      setUploadProgress(100);
      return { ok: true };
    }

    return { ok: false, error: res.error || new Error("No se pudo subir hoja_vida") };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoadingSubmit(true);

    try {
      if (!formData.primer_nombre || !formData.primer_apellido || !formData.dni) {
        setMessage({ type: "error", text: "Rellena Primer Nombre, Primer Apellido y DNI." });
        setLoadingSubmit(false);
        return;
      }

      const res = await fetch(`${API_BASE}/personal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(`Error creando personal: ${res.status} ${txt || ""}`);
      }

      const created = await res.json();
      const personalId = created?.id || created?.data?.id || (created?.data && created.data[0]?.id) || null;

      setMessage({ type: "success", text: "Personal creado correctamente." });

      if (fileToUpload && personalId) {
        const uploadRes = await uploadHojaVida(personalId);
        if (!uploadRes.ok) {
          setMessage({ type: "error", text: `Personal creado pero fallo la subida del archivo: ${uploadRes.error?.message || ""}` });
        } else {
          setMessage({ type: "success", text: "Personal y hoja de vida subidos correctamente." });
        }
      }

      if (showCreateUser && userData.usuario && userData.clave && userData.id_rol) {
        const payloadUser = {
          usuario: userData.usuario,
          clave: userData.clave,
          id_rol: userData.id_rol,
          id_personal: personalId,
        };

        const ru = await fetch(`${API_BASE}/usuario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadUser),
        });

        if (!ru.ok) {
          const txt = await ru.text().catch(() => null);
          throw new Error(`Error creando usuario: ${ru.status} ${txt || ""}`);
        }

        setMessage({ type: "success", text: "Personal y usuario creados correctamente." });
      }

      setFormData({ ...emptyForm });
      setFileToUpload(null);
      setUserData({ usuario: "", clave: "", id_rol: "" });
    } catch (err) {
      console.error("submit error", err);
      setMessage({ type: "error", text: err.message || "Error en el servidor" });
    } finally {
      setLoadingSubmit(false);
      refreshAll();
    }
  };

  return (
    <Layout userType="admin">
      <div className="regpersonal-page">
        <h1 className="regpersonal-title">👨‍✈️ Registro de Personal</h1>
        <p className="regpersonal-subtitle">Complete el formulario para registrar un nuevo miembro del personal.</p>

        {message && (
          <div className={`form-message ${message.type === "error" ? "error" : "success"}`}>{message.text}</div>
        )}

        <form className="regpersonal-form" onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Primer Nombre *</label>
              <input name="primer_nombre" value={formData.primer_nombre} onChange={handleChange} required placeholder="Primer nombre" />
            </div>

            <div className="form-group">
              <label>Segundo Nombre</label>
              <input name="segundo_nombre" value={formData.segundo_nombre} onChange={handleChange} placeholder="Segundo nombre" />
            </div>

            <div className="form-group">
              <label>Primer Apellido *</label>
              <input name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required placeholder="Primer apellido" />
            </div>

            <div className="form-group">
              <label>Segundo Apellido</label>
              <input name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo apellido" />
            </div>

            <div className="form-group">
              <label>DNI *</label>
              <input name="dni" value={formData.dni} onChange={handleChange} required placeholder="DNI" />
            </div>

            <div className="form-group">
              <label>RTN</label>
              <input name="rtn" value={formData.rtn} onChange={handleChange} placeholder="RTN (si aplica)" />
            </div>

            <div className="form-group">
              <label>Cuenta Bancaria</label>
              <input name="cuenta_bancaria" value={formData.cuenta_bancaria} onChange={handleChange} placeholder="Número de cuenta" />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
            </div>

            <div className="form-group">
              <label>Tipo de Sangre</label>
              <select name="tipo_sangre" value={formData.tipo_sangre} onChange={handleChange}>
                <option value="">-- Seleccione --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hoja de Vida (PDF)</label>
              <input type="file" name="hoja_vida" accept=".pdf" onChange={handleChange} />
              {uploadingFile && <small className="hint">Subiendo... {uploadProgress}%</small>}
            </div>

            <div className="form-group">
              <label>Fuerza</label>
              <select name="id_fuerza" value={formData.id_fuerza} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("fuerzas")}>
                <option value="">-- Seleccione Fuerza --</option>
                {fuerzas.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Rango</label>
              <select name="id_rango" value={formData.id_rango} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("rangos")}>
                <option value="">-- Seleccione Rango --</option>
                {availableRangos.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Grado</label>
              <select name="id_grado" value={formData.id_grado} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("grados")}>
                <option value="">-- Seleccione Grado --</option>
                {availableGrados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("categorias")}>
                <option value="">-- Seleccione Categoria --</option>
                {availableCategorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Arma</label>
              <select name="id_arma" value={formData.id_arma} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("armas")}>
                <option value="">-- Seleccione Arma --</option>
                {availableArmas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Área / Departamento</label>
              <select name="id_area" value={formData.id_area} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("areas")}>
                <option value="">-- Seleccione Área --</option>
                {areas.map(ar => <option key={ar.id} value={ar.id}>{ar.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <select name="id_direccion" value={formData.id_direccion} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("direcciones")}>
                <option value="">-- Seleccione Dirección --</option>
                {availableDirecciones.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Cargo</label>
              <select name="id_cargo" value={formData.id_cargo} onChange={handleChange} onFocus={() => fetchOptionsOnFocus("cargos")}>
                <option value="">-- Seleccione Cargo --</option>
                {availableCargos.map(cg => <option key={cg.id} value={cg.id}>{cg.nombre}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <input type="date" name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Serie</label>
              <input name="serie" value={formData.serie} onChange={handleChange} placeholder="Serie (solo para Oficiales)" disabled={!isSerieEnabled()} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar" disabled={loadingSubmit}>
              {loadingSubmit ? "Guardando..." : "💾 Guardar"}
            </button>

            <button type="button" className="btn-cancelar" onClick={() => { setFormData({ ...emptyForm }); setFileToUpload(null); setUserData({ usuario: "", clave: "", id_rol: "" }); setShowCreateUser(false); }}>
              ❌ Cancelar
            </button>

            <button type="button" className="btn-outline" onClick={() => setShowCreateUser(s => !s)}>
              {showCreateUser ? "Cerrar - Crear Usuario" : "➕ Crear Usuario"}
            </button>
          </div>

          {showCreateUser && (
            <div className="create-user-panel">
              <h3>Crear usuario para este personal</h3>
              <div className="user-grid">
                <div className="form-group">
                  <label>Usuario</label>
                  <input name="usuario" value={userData.usuario} onChange={handleUserChange} placeholder="usuario" />
                </div>
                <div className="form-group">
                  <label>Clave</label>
                  <input type="password" name="clave" value={userData.clave} onChange={handleUserChange} placeholder="clave segura" />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select name="id_rol" value={userData.id_rol} onChange={handleUserChange} onFocus={() => fetchOptionsOnFocus("roles")}>
                    <option value="">-- Seleccione Rol --</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default RegPersonalPage;




