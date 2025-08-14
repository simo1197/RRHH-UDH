import React from 'react'; 
import './LoginForm.css'; //importar el CSS para LoginForm
import { FaUser, FaLock } from "react-icons/fa6"; //import de icono de react
import imgLogo from '../../Assets/udhogobco.png';

const LoginForm = () => {
    return (
        <div class="wrapper-container">
    <div class="image-container">
        <img src={imgLogo} alt="Imagen de Login" class="login-image" />
    </div>
    <div class="wrapper">
        <form action=''>
            <h1>Bienvenido</h1>
            <div class="input-box">
                <input type="text" placeholder="Usuario" required />
                <FaUser class="icon" />
            </div>
            <div class="input-box">
                <input type="password" placeholder="Contraseña" required />
                <FaLock class="icon" />
            </div>
            <div class="forgot-password">
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</div>

    );
};

export default LoginForm;