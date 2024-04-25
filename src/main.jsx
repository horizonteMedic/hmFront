import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import Footer from './views/components/Footer.jsx';
import Navbar from './views/components/Navbar.jsx';
import LoginPageEmpleado from './views/empleado/Login/Login.jsx'; 
import LoginPageAdmin from './views/admin/Login/Login.jsx';
import ForgotPassword from './views/admin/Login/controller/ForgotPassword.jsx'; 
import VerificationCodeInput from './views/admin/Login/controller/VerificationCodeInput.jsx'; 
import ActualizarPassword from './views/admin/Login/controller/ActualizarPassword.jsx'
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute.jsx';
import DashboardPaciente from './views/paciente/Dashboard/Dashboard.jsx';
import DashboardEmpleado from './views/empleado/panel-de-control/PanelDeControl.jsx';
import DashboardAdmin from './views/admin/panel-de-control/PanelDeControl.jsx';
import Accesos from './views/admin/panel-de-control/Accesos/accesos.jsx';
import Roles from './views/admin/panel-de-control/Roles/Roles.jsx';
import Reporte from './views/admin/panel-de-control/Reportes/Reporte.jsx'
import Matriz from './views/admin/panel-de-control/Matriz/Matriz.jsx'
import Configuracion from './views/admin/panel-de-control/Configuracion/Configuracion.jsx';
import  ConfiguracionVistaPorRol  from './views/admin/panel-de-control/Configuracion/Confi-vista-rol/ConfiguracionVistasPorRol.jsx';
import AgregarSede from './views/admin/panel-de-control/Configuracion/AgregarSede/AgregarSede.jsx';
import Breadcrumb from './views/components/Breadcrumb.jsx'; // Importa el componente de migas de pan
import AgregarCampaña from './views/admin/panel-de-control/Configuracion/AgregarCampaña/AgregarCampaña.jsx'
import CreateArchivo from './views/admin/panel-de-control/Configuracion/CreateArchivos/CreateArchivos.jsx'
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
  const showNavbarRoutes = ['/', '/login-empleado'];
  const isLoginPage = showNavbarRoutes.includes(location.pathname);
  const isHiddenRoute = ['/forgot-password', '/verificacion-codigo'].includes(location.pathname);
  const showBreadcrumb = !isLoginPage && !isHiddenRoute;

  return (
    <>
      {!isHiddenRoute && !isLoginPage && <Navbar />}
      {showBreadcrumb && <Breadcrumb />} 
      <Routes>
        <Route path="/login-empleado" element={<LoginPageEmpleado />} />
        <Route path="/" element={<LoginPageAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verificacion-codigo" element={<VerificationCodeInput />} />
        <Route path="/actualizar-password" element={<ActualizarPassword />} />

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard-paciente" element={<DashboardPaciente />}/>
          <Route path="/dashboard-empleado" element={<DashboardEmpleado />}/>
          <Route path="/panel-de-control" element={<DashboardAdmin />}/> 
          <Route path="/accesos" element={<Accesos />}/> 
          <Route path="/roles" element={<Roles />}/> 
          <Route path="/reporte-pacientes" element={<Reporte />}/> 
          <Route path="/matriz-postulante" element={<Matriz />}/> 
          <Route path="/configuracion" element={<Configuracion />}/> 
          <Route path="/configuracion-vistas-por-rol" element={<ConfiguracionVistaPorRol />} />
          <Route path="/agregar-sede" element={<AgregarSede />} />
          <Route path="/agregar-campaña" element={<AgregarCampaña />} />
          <Route path="/lista-archivos" element={<CreateArchivo />} />

          
        </Route>
      </Routes>
      {!isLoginPage && !isHiddenRoute && <Footer />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

