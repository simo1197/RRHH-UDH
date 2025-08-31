import React from 'react';
//Import de para poder usar las funciones de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

//Importaciones de todas las pages a utilizar

import AdminPage from './pages/AdminPage/AdminPage.jsx';
import UserPage from './pages/UserPage/UserPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import BitacoraPage from './pages/BitacoraPage/BitacoraPage.jsx';
import BibliotecaPage from './pages/BibliotecaPage/BibliotecaPage.jsx';
import RegPersonalPage from './pages/PersonalPage/RegPersonalPage.jsx';
import ViewPersonalPage from './pages/ViewPersonalPage/ViewPersonalPage.jsx';
import SituacionView from './pages/SituacionView/SituacionView.jsx';
import SolicitudView from './pages/SolicitudView/SolicitudView.jsx';
import HistoriaLicencias from './pages/HistoriaLicencias/HistoriaLicencias.jsx';
import PendientesAprobacion from './pages/PendientesAprobacion/PendientesAprobacion.jsx';

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
          <Route path="/biblioteca" element={<BibliotecaPage />} />
          <Route path="/regpersonal" element={<RegPersonalPage />} />
          <Route path="/viewpersonal" element={<ViewPersonalPage />} />
          <Route path="/situacionview" element={<SituacionView />} />
          <Route path="/solicitudview" element={<SolicitudView />} />
          <Route path="/historialicencias" element={<HistoriaLicencias />} />
          <Route path="/pendientesaprobacion" element={<PendientesAprobacion />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;