import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imgLogo from '../../Assets/udhogobco.png';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-background">
            <div className="starry-background">
                {Array.from({ length: 2000 }).map((_, i) => (
                    <span key={`star-small-${i}`} className="star" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        width: `${Math.random() * 3 + 2}px`,
                        height: `${Math.random() * 3 + 2}px`,
                    }} />
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                    <span key={`star-large-${i}`} className="star-large" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        width: `${Math.random() * 6 + 3}px`,
                        height: `${Math.random() * 6 + 3}px`,
                    }} />
                ))}
            </div>

            <div className="wrapper-container">
                <div className="image-container">
                    <img src={imgLogo} alt="Imagen de Login" className="login-image" />
                </div>

                <div className="wrapper glowing-border">
                    <form>
                        <h1>Bienvenido</h1>

                        <div className="input-box">
                            <input type="text" placeholder="Usuario" required />
                            <FaUser className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
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










