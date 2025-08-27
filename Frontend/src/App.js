import React from 'react';
//Import de para poder usar las funciones de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

//Importaciones de todas las pages a utilizar

import AdminPage from './pages/AdminPage/AdminPage.jsx';
import UserPage from './pages/UserPage/UserPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import BitacoraPage from './pages/BitacoraPage/BitacoraPage.jsx';

function App() {
  return (
    <div>
      {/* Encapsulamos todas las rutas dentro de un BrowserRouter */}
      <BrowserRouter>
        {/* Luego declaramos las rutas que contendra el encapsulador */}
        <Routes>
          
          {/* Cada ruta singular estara dentro de Route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/bitacora" element={<BitacoraPage />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;




