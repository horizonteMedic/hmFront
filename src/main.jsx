import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPagePaciente from './views/paciente/Login/Login.jsx'; 
import LoginPageEmpleado from './views/empleado/Login/Login.jsx'; 
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute.jsx';
import './index.css';
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/js/tabler.js';
import Footer from './views/components/Footer.jsx';
import RegistroDePacientes from './views/empleado/RegistroPacientes/RegistroPacientes.jsx';
import Triaje from './views/empleado/Triaje/Triaje.jsx'; // Importa el componente Triaje
import ForgotPassword from './views/paciente/Login/ForgotPassword.jsx'; // Importa el componente de recuperación de contraseña


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashboardPaciente from './views/paciente/Dashboard/Dashboard.jsx';
import DashboardEmpleado from './views/empleado/panel-de-control/PanelDeControl.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPagePaciente />} />
        <Route path="/login-empleado" element={<LoginPageEmpleado />} />

        <Route path="/registro-de-pacientes" element={<RegistroDePacientes />} /> {/* Ruta para RegistroDePacientes */}
        <Route path="/triaje" element={<Triaje />} /> {/* Ruta para Triaje */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} /> {/* Ruta para Triaje */}

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard-paciente" element={<DashboardPaciente />}/>
          <Route path="/dashboard-empleado" element={<DashboardEmpleado />}/>
        </Route>
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
);
