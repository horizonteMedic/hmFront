import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPagePaciente from './views/paciente/Login/Login.jsx'; 
import LoginPageEmpleado from './views/empleado/Login/Login.jsx'; 
import ProtectedRoute from './views/ProtectedRoute/ProtectedRoute.jsx';
import './index.css';
import '@tabler/core/dist/css/tabler.min.css';
import Footer from './views/components/Footer.jsx';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './views/paciente/Dashboard/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPagePaciente/> 
  },
  {
    path: "/login-empleado",
    element: <LoginPageEmpleado/>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute/>,
    children: [
      {
        path: "",
        element: <Dashboard/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Footer/>
  </React.StrictMode>,
);
