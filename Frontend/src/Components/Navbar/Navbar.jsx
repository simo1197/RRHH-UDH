import React, { useState } from "react";
import { Sun, Moon, Menu, X, User, LogOut, Settings } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="navbar-left">
        <span className="logo">UDH2024</span>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <a href="#">Inicio</a>
        <a href="#">Personal</a>
        <a href="#">Evaluaciones</a>
        <a href="#">Biblioteca</a>
      </div>

      <div className="navbar-right">
        {/* Botón DarkMode */}
        <button onClick={toggleDarkMode} className="icon-btn">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Menú de usuario */}
        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Usuario"
              className="user-img"
            />
          </button>

          {userMenuOpen && (
            <div className="dropdown">
              <div className="user-info">
                <img
                  src="https://i.pravatar.cc/60"
                  alt="Usuario"
                  className="user-img-large"
                />
                <div>
                  <p className="username">Juan Pérez</p>
                  <p className="user-email">juanperez@udh.edu</p>
                </div>
              </div>
              <hr />
              <a href="#"><User size={16} /> Perfil</a>
              <a href="#"><Settings size={16} /> Configuración</a>
              <a href="#"><LogOut size={16} /> Cerrar sesión</a>
            </div>
          )}
        </div>

        {/* Menú responsive */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}




