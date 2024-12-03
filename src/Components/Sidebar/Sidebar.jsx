import React from 'react'; 
import './Sidebar.css'; 

const Sidebar = () => {
    return (
        <div className="sidebar">
        <h2>Mi Sidebar</h2>
        {/* Agrega aquí enlaces o cualquier otro contenido */}
        <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Configuración</a></li>
            <li><a href="#">Cerrar sesión</a></li>
        </ul>
    </div> 

    );
};

export default Sidebar;