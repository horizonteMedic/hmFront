import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import Footer from './views/components/Footer.jsx';
import Navbar from './views/components/Navbar.jsx';
import LoginPageEmpleado from './views/empleado/Login/Login.jsx'; 
import LoginPageAdmin from './views/admin/Login/Login.jsx';
import ForgotPassword from './views/admin/Login/ForgotPassword.jsx'; 
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute.jsx';
import DashboardPaciente from './views/paciente/Dashboard/Dashboard.jsx';
import DashboardEmpleado from './views/empleado/panel-de-control/PanelDeControl.jsx';
import DashboardAdmin from './views/admin/panel-de-control/PanelDeControl.jsx';
import Accesos from './views/admin/panel-de-control/Accesos/Accesos.jsx';
import Roles from './views/admin/panel-de-control/Roles/Roles.jsx';
import Reporte from './views/admin/panel-de-control/Reportes/Reporte.jsx'
import Matriz from './views/admin/panel-de-control/Matriz/Matriz.jsx'
import Configuracion from './views/admin/panel-de-control/Configuracion/Configuracion.jsx';



const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <AppContent />
      </Router>
    </React.StrictMode>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login-empleado';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/login-empleado" element={<LoginPageEmpleado />} />
        <Route path="/" element={<LoginPageAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard-paciente" element={<DashboardPaciente />}/>
          <Route path="/dashboard-empleado" element={<DashboardEmpleado />}/>
          <Route path="/panel-de-control" element={<DashboardAdmin />}/> 
          <Route path="/accesos" element={<Accesos />}/> 
          <Route path="/roles" element={<Roles />}/> 
          <Route path="/reporte-pacientes" element={<Reporte />}/> 
          <Route path="/matriz-postulante" element={<Matriz />}/> 
          <Route path="/configuracion" element={<Configuracion />}/> 
        </Route>
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
