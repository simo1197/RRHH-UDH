
import LoginForm from './Components/LoginForm/LoginForm';

//Import de para poder usar las funciones de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

function App() {
  return (
    <div>
      {/* Encapsulamos todas las rutas dentro de un BrowserRouter */}
      <BrowserRouter>
        {/* Luego declaramos las rutas que contendra el encapsulador */}
        <Routes>
          
          {/* Cada ruta singular estara dentro de Route */}
          <Route path="/" element={<LoginForm/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


