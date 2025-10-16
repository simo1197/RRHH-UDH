// Frontend/src/Components/LoginForm/LoginForm.jsx
// Actualizado por mí: uso de la URL del backend desde env, envio de "clave" (no "password"),
// manejo de la respuesta del backend (id, usuario, id_rol, id_personal) y guardado en localStorage.
// Hice solo los cambios necesarios — no toqué estilos ni la lógica visual.

import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imgLogo from '../../Assets/udhogobco.png';
import { useNavigate } from 'react-router-dom';

// Leo la base API desde las variables de entorno (si no existe, uso la local por defecto)
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

const LoginForm = () => {
    // Estados del componente
    const [showPassword, setShowPassword] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Alterno visibilidad de contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Manejo del submit del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Envío la clave con la clave "clave" porque el backend espera { usuario, clave }
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, clave: password })
            });

            // Leo respuesta como texto y luego intento parsear JSON (manejo robusto)
            const text = await response.text();
            let payload = null;
            try { payload = text ? JSON.parse(text) : null; } catch (err) { payload = null; }

            // Si OK => backend devolvió datos del usuario (id, usuario, id_rol, id_personal)
            if (response.ok && payload && payload.usuario) {
                // Guardo en localStorage el usuario actual (puedes cambiar a sessionStorage si prefieres)
                // Guardaré sólo datos no sensibles devueltos por el backend.
                const userToStore = {
                    id: payload.id,
                    usuario: payload.usuario,
                    id_rol: payload.id_rol,
                    id_personal: payload.id_personal
                };
                localStorage.setItem('currentUser', JSON.stringify(userToStore));

                // Redirijo al panel de admin (igual que antes)
                navigate('/admin');
                return;
            }

            // Manejo de errores por código HTTP y detalle enviado por backend
            let message = 'Usuario o contraseña incorrectos';
            if (response.status === 401) {
                if (payload && payload.detail) message = payload.detail;
                alert(message);
                setError(message);
            } else if (response.status === 404) {
                // Usuario no encontrado
                if (payload && payload.detail) message = payload.detail;
                else message = 'Usuario no encontrado';
                alert(message);
                setError(message);
            } else if (response.status === 503) {
                if (payload && payload.detail) message = payload.detail;
                else message = 'No hay conexión con el servidor';
                alert(message);
                setError(message);
            } else if (response.status === 500) {
                message = (payload && payload.detail) ? payload.detail : 'Error interno del servidor';
                alert(message);
                setError(message);
            } else {
                // Otros estados (400, etc.)
                message = (payload && payload.detail) ? payload.detail : `Error: ${response.status}`;
                alert(message);
                setError(message);
            }
        } catch (err) {
            // Capturo fallos de conexión / excepciones de fetch
            console.error('Fetch error:', err);
            const msg = 'Error de conexión con el servidor';
            alert(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-background">
            <div className="starry-background">
                {Array.from({ length: 250 }).map((_, i) => (
                    <span key={`star-small-${i}`} className="star" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 8}s`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                    }} />
                ))}
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={`star-large-${i}`} className="star-large" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 15}s`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                    }} />
                ))}
            </div>

            <div className="wrapper-container">
                <div className="image-container">
                    <img src={imgLogo} alt="Imagen de Login" className="login-image" />
                </div>

                <div className="wrapper glowing-border">
                    <form onSubmit={handleSubmit}>
                        <h1>Bienvenido</h1>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <FaUser className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <FaLock className="icon" />
                            <span
                                className="eye-icon"
                                onClick={togglePasswordVisibility}
                                title={showPassword ? "Ocultar" : "Mostrar"}
                                role="button"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;













