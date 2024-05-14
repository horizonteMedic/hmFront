import React, { useEffect } from 'react';
import { isTokenExpired, useAuthStore } from './store/auth.js';
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
import {ProtectedRoute,ProtectedLogin,ProtectedPanel} from './views/ProtectedRoute/ProtectedRoute.jsx';
import DashboardPaciente from './views/paciente/Dashboard/Dashboard.jsx';
import DashboardEmpleado from './views/empleado/panel-de-control/PanelDeControl.jsx';
import DashboardAdmin from './views/admin/panel-de-control/PanelDeControl.jsx';
import Accesos from './views/admin/panel-de-control/Accesos/accesos.jsx';
import Roles from './views/admin/panel-de-control/Roles/Roles.jsx';
import Reporte from './views/admin/panel-de-control/Reportes/Reporte.jsx'
import Matriz from './views/admin/panel-de-control/Matriz/Matriz.jsx'
import Configuracion from './views/admin/panel-de-control/Configuracion/Configuracion.jsx';
import AgregarSede from './views/admin/panel-de-control/Configuracion/AgregarSede/AgregarSede.jsx';
import Breadcrumb from './views/components/Breadcrumb.jsx'; 
import AgregarCampaña from './views/admin/panel-de-control/Configuracion/AgregarCampaña/AgregarCampaña.jsx'
import CreateArchivo from './views/admin/panel-de-control/Configuracion/CreateArchivos/CreateArchivos.jsx'
import AdministrarEmpresas from './views/admin/panel-de-control/Configuracion/AdministrarEmpresas/AdministrarEmpresas.jsx'
import AdministrarContratas from './views/admin/panel-de-control/Configuracion/AdministrarContratas/AdministrarContratas.jsx'
// MINERA VISTAS
import LabortorioClinicoMinera from './views/admin/panel-de-control/Minera/LabortorioClinicoMinera/Labortorio-clinico-minera.jsx'
import ReportesMinera from './views/admin/panel-de-control/Minera/ReportesMinera/reportes-minera.jsx'
import TriajeMinera from './views/admin/panel-de-control/Minera/TriajeMinera/triaje-minera.jsx'



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
  const token = useAuthStore(state => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);
  const setlistView = useAuthStore((state) => state.setlistView)

  const location = useLocation();
  const showNavbarRoutes = ['/', '/login-empleado'];
  const isLoginPage = showNavbarRoutes.includes(location.pathname);
  const isHiddenRoute = ['/forgot-password', '/verificacion-codigo', '/actualizar-password'].includes(location.pathname);
  const showBreadcrumb = !isLoginPage && !isHiddenRoute;

  useEffect(() => {
    if (isTokenExpired(token)) {
      // El token ha caducado, realizar acciones necesarias
      setToken(null);
      setuserlogued(null);
      setlistView([])
    }
  },[token])

  

  return (
    <>
      {!isHiddenRoute && !isLoginPage && <Navbar />}
      {showBreadcrumb && <Breadcrumb />} 
      <Routes>
        <Route element={<ProtectedLogin/>}>
          <Route path="/" element={<LoginPageAdmin />} />
        </Route>
        <Route path="/login-empleado" element={<LoginPageEmpleado />} />
    
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verificacion-codigo" element={<VerificationCodeInput />} />
        <Route path="/actualizar-password" element={<ActualizarPassword />} />

        <Route element={<ProtectedPanel/>}>
          <Route path="/panel-de-control" element={<DashboardAdmin />}/> 
        </Route>

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard-paciente" element={<DashboardPaciente />}/>
          <Route path="/dashboard-empleado" element={<DashboardEmpleado />}/>
          <Route path="/accesos" element={ <Accesos />}  /> 
          <Route path="/roles" element={<Roles />}/> 
          <Route path="/reporte-pacientes" element={<Reporte />}/> 
          <Route path="/matriz-postulante" element={<Matriz />}/> 
          <Route path="/configuracion" element={<Configuracion />}/> 
          <Route path="/agregar-sede" element={<AgregarSede />} />
          <Route path="/agregar-campaña" element={<AgregarCampaña />} />
          <Route path="/lista-archivos" element={<CreateArchivo />} />
          <Route path="/administrar-empresas" element={<AdministrarEmpresas />} />
          <Route path="/administrar-contratas" element={<AdministrarContratas />} />
          
        </Route>
        {/* Minera */}
          <Route path="/laboratorio-clinico-minera" element={<LabortorioClinicoMinera />} />
          <Route path="/reportes-minera" element={<ReportesMinera />} />
          <Route path="/triaje-minera" element={<TriajeMinera />} />
      </Routes>
      {!isLoginPage && !isHiddenRoute && <Footer />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

