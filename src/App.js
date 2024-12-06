//Import de para poder usar las funciones de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

//Importaciones de todas las pages a utilizar

import AdminPage from './Pages/AdminPage/AdminPage';
import UserPage from './Pages/UserPage/UserPage';
import LoginPage from './Pages/LoginPage/LoginPage';

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
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


