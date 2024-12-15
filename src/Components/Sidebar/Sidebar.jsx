
import React, { useState } from "react";
import './Sidebar.css'; //importamos archivo css para el sidebar//
import imgLogo from '../../Assets/UDH.jpg'; //importamos la imagen del logo//
import 'boxicons/css/boxicons.min.css';


// Sidebar.js (o el archivo donde tienes tu componente Sidebar)
const Sidebar = () => {

  // Estado para el tema
  const [darkMode, setDarkMode] = useState(false);

  // Función para alternar el modo
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Cambiar la clase del body cuando el modo se alterna
    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

    return (
      /*<div className="mi-componente"></div>*/
      <div className={`mi-componente ${darkMode ? "dark" : ""}`}>
       <nav class="sidebar">
        <header>
            <div class="image-text">
            <span class="image">
               <img src={imgLogo} alt="Imagen de Login" class="login-image" />
            </span>
            <div class="text header-text">
              <span class="direccion">Recursos Humanos</span>
            </div>
            </div>
            <i class='bx bx-chevron-right toggle'></i>
        </header>
        <div class="menu-bar">
          <div class="menu">
           <ul class="menu-links"> 
              <li class="nav-links">
             <a href="#">
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Personal</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bx-receipt icon'></i>
             <span class="text nav-text">Licencias</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bxs-bar-chart-square icon' ></i>
             <span class="text nav-text">Evaluaciones</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bx-check-double icon'></i>
             <span class="text nav-text">Servicio</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bx-library icon' ></i>
             <span class="text nav-text">Biblioteca</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bx-stats icon'></i>
             <span class="text nav-text">Bitacora</span>
             </a>
             </li>
           </ul>
          </div>
          <div class="bottom-content">
        <li class="">
             <a href="#">
             <i class='bx bx-log-out icon'></i>
             <span class="text nav-text">salir</span>
             </a>
        </li>

        <li className="mode">
              <div className="moon-sun">
                <i className={`bx bx-moon icon moon ${darkMode ? "active" : ""}`}></i>
                <i className={`bx bx-sun icon sun ${!darkMode ? "active" : ""}`}></i>
              </div>
              <span className="mode-text text">Noche</span>

              <div className="toggle-switch" onClick={toggleDarkMode}>
                <span className="switch"></span>
              </div>
        </li>
        </div>
        </div>
       </nav>
      </div>
    );
  };
  

export default Sidebar;

