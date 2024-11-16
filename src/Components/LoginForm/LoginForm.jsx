import React from 'react';
import './LoginForm.css';

const LoginForm = () => {
    return (
        <div className='wrapper'> 
            <form action=''>
                 <h1>Login</h1>
                 <div className='input-box'>
                      <input type='text' placeholder='Username' required />
                 </div>
                 <div className='input-box'>
                      <input type='text' placeholder='Username' required />
                 </div>
            </form>
        </div>
    );
};

export default LoginForm;