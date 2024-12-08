
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
            <i class='bx bx-chevron-right'></i>
        </header>
       </nav>
      </div>
    );
  };
  

export default Sidebar;