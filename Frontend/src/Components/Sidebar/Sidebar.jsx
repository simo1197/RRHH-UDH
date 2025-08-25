import React, { useEffect, useState } from "react";
import './Sidebar.css';
import imgLogo from '../../Assets/LOGOUDH.png';
import 'boxicons/css/boxicons.min.css';
import { Home, Users, BookOpen, Settings } from "lucide-react";


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const toggleSubMenu = (menu) => {
    setOpenMenu(prev => (prev === menu ? null : menu));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

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

          {/* botón para colapsar/expandir */}
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Lista de personal</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Registrar personal</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Editar / Actualizar datos</a></li>
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Solicitar licencia</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Historial de licencias</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Aprobaciones pendientes</a></li>
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Evaluar personal</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Resultados de evaluaciones</a></li>
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Matriz de situación</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Asignar situación</a></li>
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Documentos</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Subir documento</a></li>
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
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Ver bitácora completa</a></li>
                  <li><a href="#" onClick={(e)=>e.preventDefault()}>Filtrar por usuario</a></li>
                </ul>
              </li>

            </ul>
          </div>

          {/* BOTTOM CONTENT (fijo abajo) */}
          <div className="bottom-content">
            <li className="logout">
              <a href="#" onClick={(e)=>{ e.preventDefault(); /* logout logic */ }}>
                <i className='bx bx-log-out icon' />
                <span className="text nav-text">Salir</span>
              </a>
            </li>

            <li className="mode" onClick={toggleDarkMode} role="button" tabIndex={0}>
              <div className="moon-sun">
                <i className={`bx ${darkMode ? 'bx-moon' : 'bx-sun'} icon`} />
                <span className="mode-text text">Noche</span>
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