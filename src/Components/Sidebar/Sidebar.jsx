
import React from "react";
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
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Vacaciones y Permisos</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Evaluaciones</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Servicio</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Biblioteca</span>
             </a>
             </li>
             <li class="nav-links">
             <a href="#">
             <i class='bx bxs-user icon'></i>
             <span class="text nav-text">Bitacora</span>
             </a>
             </li>
           </ul>
          </div>
        </div>
       </nav>
      </div>
    );
  };
  

export default Sidebar;