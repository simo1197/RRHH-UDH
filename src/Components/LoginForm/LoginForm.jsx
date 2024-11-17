import React from 'react'; 
import './LoginForm.css'; //importar el CSS para LoginForm
import { FaUser, FaLock } from "react-icons/fa6"; //import de icono de react

const LoginForm = () => {
    return (
        <div className='wrapper'> 
            <form action=''>
                 <h1>Bienvenido</h1>
                 <div className='input-box'>
                      <input type='text' placeholder='Usuario' required />
                      <FaUser className='icon' /> 
                 </div>
                 <div className='input-box'>
                      <input type='password' placeholder='Contraseña' required />
                      <FaLock className='icon'/>
                 </div>
                 <div class="forgot-password">
                 <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                 </div>

                 <button type='submit'>Iniciar Sesión</button>

            </form>
        </div>
    );
};

export default LoginForm;