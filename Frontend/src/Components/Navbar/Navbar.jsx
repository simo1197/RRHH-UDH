import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState("Soleado");
  const [notifications] = useState([]); // Lista de notificaciones

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("es-ES");

  const user = { name: "Juan Pérez", email: "juanperez@udh.edu", gender: "M" };
  const saludo = user.gender === "F" ? "Bienvenida" : "Bienvenido";

  return (
    <nav className="navbar">
      {/* Marca de agua */}
      <div className="navbar-left">
        <span className="watermark">GD@2024</span>
      </div>

      {/* Texto central con saludo */}
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <span className="welcome-text">
          {saludo}, {user.name}
        </span>
      </div>

      {/* Derecha */}
      <div className="navbar-right">
        <div className="datetime-weather">
          <span className="date">{formattedDate}</span>
          <span className="time">{formattedTime}</span>
          <span className="weather">{weather}</span>
        </div>

        {/* Notificaciones con panel desplegable */}
        <div className="notif-menu">
          <button
            className="notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={20} />
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {notifications.length === 0 ? (
                <p className="no-notifs">Sin novedades</p>
              ) : (
                notifications.map((n, i) => (
                  <p key={i} className="notif-item">{n}</p>
                ))
              )}
            </div>
          )}
        </div>

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
            <div className="dropdown elegant-profile">
              <div className="user-info">
                <img
                  src="https://i.pravatar.cc/80"
                  alt="Usuario"
                  className="user-img-large"
                />
                <div className="user-details">
                  <p className="username">{user.name}</p>
                  <p className="user-email">{user.email}</p>
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



