// Frontend/src/Components/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imgLogo from '../../Assets/udhogobco.png';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
            });

            // Leer la respuesta como texto primero y luego intentar parsear JSON
            const text = await response.text();
            let payload = null;
            try { payload = JSON.parse(text); } catch (err) { payload = null; }

            if (response.ok && payload && payload.access_token) {
                // Login exitoso
                localStorage.setItem('token', payload.access_token);
                navigate('/admin');
                return;
            }

            // Manejo de errores por código HTTP y detalle enviado por backend
            let message = 'Usuario o contraseña incorrectos';
            if (response.status === 401) {
                // 401: usuario no existe o contraseña incorrecta
                if (payload && payload.detail) message = payload.detail;
                alert(message);
                setError(message);
            } else if (response.status === 503) {
                // 503: problema con servidor/BD
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












