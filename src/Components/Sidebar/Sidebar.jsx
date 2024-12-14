
import React  from "react";
import './Sidebar.css'; //importamos archivo css para el sidebar//
import imgLogo from '../../Assets/UDH.jpg'; //importamos la imagen del logo//
import 'boxicons/css/boxicons.min.css';




// Sidebar.js (o el archivo donde tienes tu componente Sidebar)
const Sidebar = () => {
  
    return (
      <div className="mi-componente">
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

        <li class="mode">
             <div class="moon-sun">
             <i class='bx bx-moon icon moon'></i>
             <i class='bx bx-sun icon sun'></i>
             </div>
             <span class="mode-text text">Noche</span>

             <div class="toggle-switch">
              <span class="switch"></span>
             </div>
        </li>
        </div>
        </div>
       </nav>
      </div>
    );
  };
  

export default Sidebar;

