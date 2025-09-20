import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './Sidebar.css';
import imgLogo from '../../Assets/LOGOUDH.png';
import 'boxicons/css/boxicons.min.css';

const Sidebar = ({ collapsed, setCollapsed }) => { 
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const navigate = useNavigate(); 

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleSidebar = () => {
    if (!collapsed) setOpenMenu(null);
    setCollapsed(prev => !prev); 
  };

  const toggleSubMenu = (menu) => {
    setOpenMenu(prev => (prev === menu ? null : menu));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("¿Desea cerrar sesión?");
    if (confirmLogout) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true }); 
    }
  };

  return (
    <div className={`mi-componente ${darkMode ? "dark" : ""}`}>
      <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <header>
          <div className="image-text">
            <span className="image">
              <img src={imgLogo} alt="Logo UDH" />
            </span>
            <div className={`header-text ${collapsed ? "collapsed-text" : ""}`}>
              <span className="direccion">Recursos Humanos</span>
            </div>
          </div>

          <div
            className="toggle"
            role="button"
            tabIndex={0}
            onClick={toggleSidebar}
            onKeyDown={(e) => { if (e.key === 'Enter') toggleSidebar(); }}
            aria-label="Colapsar menú"
          >
            <i className={`bx ${collapsed ? 'bx-chevrons-right' : 'bx-chevrons-left'}`} />
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">

              {/* PERSONAL */}
              <li className={`menu-item ${openMenu === 'personal' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('personal'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bxs-user icon' />
                  <span className="text nav-text">Personal</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'personal' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/viewpersonal"); }}>Lista de personal</a></li>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/regpersonal"); }}>Registrar personal</a></li>
                </ul>
              </li>

              {/* LICENCIAS */}
              <li className={`menu-item ${openMenu === 'licencias' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('licencias'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bx-receipt icon' />
                  <span className="text nav-text">Licencias</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'licencias' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/solicitudview"); }}>Solicitar licencia</a></li>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/historialicencias"); }}>Historial de licencias</a></li>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/pendientesaprobacion"); }}>Aprobaciones pendientes</a></li>
                </ul>
              </li>

              {/* EVALUACIONES */}
              <li className={`menu-item ${openMenu === 'evaluaciones' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('evaluaciones'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bxs-bar-chart-square icon' />
                  <span className="text nav-text">Evaluaciones</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'evaluaciones' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/evaluatepage"); }}>Evaluar personal</a></li>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/evaluatehistorypage"); }}>Resultados de evaluaciones</a></li>
                </ul>
              </li>

              {/* SERVICIO */}
              <li className={`menu-item ${openMenu === 'servicio' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('servicio'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bx-check-double icon' />
                  <span className="text nav-text">Servicio</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'servicio' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/situacionview"); }}>Matriz de situación</a></li>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/situacionespage"); }}>Asignar situación</a></li>
                </ul>
              </li>

              {/* BIBLIOTECA */}
              <li className={`menu-item ${openMenu === 'biblioteca' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('biblioteca'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bx-library icon' />
                  <span className="text nav-text">Biblioteca</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'biblioteca' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/biblioteca"); }}>Documentos</a></li>
                </ul>
              </li>

              {/* BITÁCORA */}
              <li className={`menu-item ${openMenu === 'bitacora' ? 'open' : ''}`}>
                <div
                  className="nav-links"
                  onClick={() => { if (!collapsed) toggleSubMenu('bitacora'); }}
                  style={{ cursor: collapsed ? 'default' : 'pointer' }}
                >
                  <i className='bx bx-stats icon' />
                  <span className="text nav-text">Bitácora</span>
                  {!collapsed && <i className="bx bx-chevron-down arrow" />}
                </div>
                <ul className={`submenu ${openMenu === 'bitacora' ? 'open' : ''}`}>
                  <li><a href="#" onClick={(e)=>{ e.preventDefault(); navigate("/bitacora"); }}>Ver bitácora completa</a></li>
                </ul>
              </li>

            </ul>
          </div>

          <div className="bottom-content">
            <li className="logout">
              <a href="#" onClick={handleLogout}>
                <i className='bx bx-log-out icon' />
                <span className="text nav-text">Salir</span>
              </a>
            </li>

            <li className="mode" onClick={toggleDarkMode} role="button" tabIndex={0}>
              <div className="moon-sun">
                <i className={`bx ${darkMode ? 'bx-moon' : 'bx-sun'} icon`} />
                {!collapsed && (
                  <span className="mode-text text">
                    {darkMode ? 'Noche' : 'Día'}
                  </span>
                )}
              </div>
              <div className="toggle-switch" aria-pressed={darkMode}>
                <span className="switch" />
              </div>
            </li>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
