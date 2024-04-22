import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import LoginPagePaciente from './views/paciente/Login/Login.jsx'; 
import LoginPageEmpleado from './views/empleado/Login/Login.jsx'; 
import LoginPageAdmin from './views/admin/Login/Login.jsx'
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute.jsx';
import './index.css';
import Footer from './views/components/Footer.jsx';

import ForgotPassword from './views/admin/Login/ForgotPassword.jsx'; 


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPaciente from './views/paciente/Dashboard/Dashboard.jsx';
import DashboardEmpleado from './views/empleado/panel-de-control/PanelDeControl.jsx';
import DashboardAdmin from './views/admin/panel-de-control/PanelDeControl.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPagePaciente />} />
        <Route path="/login-empleado" element={<LoginPageEmpleado />} />
        <Route path="/login-admin" element={<LoginPageAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route element={<ProtectedRoute/>}>
          {/* dashboarsd para paciente y emmpleado */}
          <Route path="/dashboard-paciente" element={<DashboardPaciente />}/>
          <Route path="/dashboard-empleado" element={<DashboardEmpleado />}/>
          {/* panel de control del admin y vistas dentro de sus panel */}
          <Route path="/panel-de-control" element={<DashboardAdmin />}/> 
          <Route path="/accesos" element={<DashboardAdmin />}/> 
          <Route path="/roles" element={<DashboardAdmin />}/> 
          <Route path="/reporte-pacientes" element={<DashboardAdmin />}/> 
          <Route path="/matriz-postulante" element={<DashboardAdmin />}/> 
          <Route path="/configuracion" element={<DashboardAdmin />}/> 

        </Route>


      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
);