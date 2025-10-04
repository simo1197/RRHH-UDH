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
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/admin');
                return;
            }

            // Si no OK, intentar leer JSON de error
            let errDetail = 'Usuario o contraseña incorrectos';
            try {
                const errJson = await response.json();
                errDetail = errJson.detail || errDetail;
            } catch (parseErr) {
                // si no es JSON dejamos el mensaje por defecto
            }
            setError(errDetail);

        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error de conexión con el servidor');
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
                            />
                            <FaLock className="icon" />
                            <span
                                className="eye-icon"
                                onClick={togglePasswordVisibility}
                                title={showPassword ? "Ocultar" : "Mostrar"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;











