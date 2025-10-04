// src/pages/BitacoraPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/Layout";
import "./BitacoraPage.css";

const API_BASE = "http://127.0.0.1:8000";

const BitacoraPage = () => {
  const [eventos, setEventos] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("asc"); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAuthError = () => {
    localStorage.removeItem("token");
    setError("Token inválido o expirado. Por favor inicia sesión nuevamente.");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  const fetchEventos = async (opts = {}) => {
    setLoading(true);
    setError("");
    const usuarioQuery = opts.usuarioQuery ?? filtroUsuario;
    const pageQuery = opts.page ?? page;
    const sortQuery = opts.sort ?? sort;

    try {
      let url = `${API_BASE}/bitacora?page=${pageQuery}&page_size=${pageSize}&sort=${sortQuery}`;
      if (usuarioQuery) url += `&usuario=${encodeURIComponent(usuarioQuery)}`;

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const resp = await fetch(url, { headers });
      if (resp.status === 401) {
        handleAuthError();
        return;
      }
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setError(err.detail || "Error al obtener bitácora");
        setEventos([]);
        setLoading(false);
        return;
      }
      const json = await resp.json();
      setEventos(json.results || []);
      setTotal(json.total || 0);
      setPage(json.page || 1);
      setSort(sortQuery);
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Error de conexión con el servidor");
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos({ page: 1, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = async () => {
    setPage(1);
    await fetchEventos({ usuarioQuery: filtroUsuario, page: 1, sort });
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goPrev = () => {
    if (page > 1) {
      const p = page - 1;
      setPage(p);
      fetchEventos({ page: p, sort });
    }
  };

  const goNext = () => {
    if (page < totalPages) {
      const p = page + 1;
      setPage(p);
      fetchEventos({ page: p, sort });
    }
  };

  const changeSort = async (s) => {
    setSort(s);
    setPage(1);
    await fetchEventos({ page: 1, sort: s });
  };

  return (
    <Layout userType="user">
      <div className="bitacora-page">
        <h1>Bitácora de Eventos</h1>

        <div className="filter-container">
          <label htmlFor="filtroUsuario">Filtrar por usuario:</label>
          <input
            type="text"
            id="filtroUsuario"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            placeholder="Ingrese nombre del usuario"
          />
          <button onClick={handleBuscar}>Buscar</button>
          <button
            onClick={() => {
              setFiltroUsuario("");
              setPage(1);
              fetchEventos({ page: 1, sort });
            }}
          >
            Limpiar
          </button>
        </div>

        <div className="controls-right">
          <label>Orden:</label>
          <button onClick={() => changeSort("asc")} disabled={sort === "asc"}>
            Asc
          </button>
          <button onClick={() => changeSort("desc")} disabled={sort === "desc"}>
            Desc
          </button>
        </div>

        {loading ? (
          <p>Cargando eventos...</p>
        ) : error ? (
          <div className="error-message">⚠️ {error}</div>
        ) : (
          <>
            <div
              style={{
                maxHeight: "420px",
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "8px",
                marginTop: "12px",
              }}
            >
              <table className="bitacora-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Fecha / Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.length === 0 ? (
                    <tr>
                      <td colSpan="4">No hay eventos</td>
                    </tr>
                  ) : (
                    eventos.map((evento) => (
                      <tr key={evento.id || Math.random()}>
                        <td>{evento.id}</td>
                        <td>{evento.usuario}</td>
                        <td>{evento.accion}</td>
                        <td>{evento.fecha_hora}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={goPrev} disabled={page <= 1}>
                ← Anterior
              </button>
              <span>
                Página {page} de {totalPages} — Total eventos: {total}
              </span>
              <button onClick={goNext} disabled={page >= totalPages}>
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BitacoraPage;

