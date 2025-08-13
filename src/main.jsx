import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getFetch } from "./views/admin/panel-de-control/getFetch/getFetch.js";
import { isTokenExpired, useAuthStore } from "./store/auth.js";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Footer from "./views/components/Footer.jsx";
import Navbar from "./views/components/Navbar.jsx";
import LoginPageAdmin from "./views/admin/Login/Login.jsx";
import ForgotPassword from "./views/admin/Login/controller/ForgotPassword.jsx";
import VerificationCodeInput from "./views/admin/Login/controller/VerificationCodeInput.jsx";
import ActualizarPassword from "./views/admin/Login/controller/ActualizarPassword.jsx";
import {
  ProtectedRoute,
  ProtectedLogin,
  ProtectedPanel,
} from "./views/ProtectedRoute/ProtectedRoute.jsx";
import DashboardAdmin from "./views/admin/panel-de-control/PanelDeControl.jsx";
import Accesos from "./views/admin/panel-de-control/Accesos/accesos.jsx";
import Roles from "./views/admin/panel-de-control/Roles/Roles.jsx";
import Reporte from "./views/admin/panel-de-control/Reportes/Reporte.jsx";
import Matriz from "./views/admin/panel-de-control/Matriz/Matriz.jsx";
import Configuracion from "./views/admin/panel-de-control/Configuracion/Configuracion.jsx";
import AgregarSede from "./views/admin/panel-de-control/Configuracion/AgregarSede/AgregarSede.jsx";
import Breadcrumb from "./views/components/Breadcrumb.jsx";
import AgregarCampaña from "./views/admin/panel-de-control/Configuracion/AgregarCampaña/AgregarCampaña.jsx";
import CreateArchivo from "./views/admin/panel-de-control/Configuracion/CreateArchivos/CreateArchivos.jsx";
import AdministrarEmpresas from "./views/admin/panel-de-control/Configuracion/AdministrarEmpresas/AdministrarEmpresas.jsx";
import AdministrarContratas from "./views/admin/panel-de-control/Configuracion/AdministrarContratas/AdministrarContratas.jsx";
import Protocolos from "./views/admin/panel-de-control/Configuracion/Protocolos/Protocolos.jsx";
import LibroDeReclamaciones from "./views/admin/LibroDeReclamaciones/LibroDeReclamaciones.jsx";
import Formulario from "./views/admin/RegistroUnico/Formulario.jsx";
import SistemaOcupacional from "./views/admin/panel-de-control/SistemaOcupacional/SistemaOcupacional.jsx";
import HistoriaOcupacional from "./views/admin/panel-de-control/SistemaOcupacional/HistoriaOcupacional/HistoriaOcupacional.jsx";
import Espirometria from "./views/admin/panel-de-control/SistemaOcupacional/Espirometria/Espirometria.jsx";
import OftalmologiaTabSelector from "./views/admin/panel-de-control/SistemaOcupacional/Oftalmologia/OftalmologiaTabSelector.jsx";
import MusculoEsqueleticoTabSelector from "./views/admin/panel-de-control/SistemaOcupacional/Musculoesqueletico/MusculoEsqueleticoTabSelector.jsx";
import Odontologia from "./views/admin/panel-de-control/SistemaOcupacional/Odontologia/Odontologia.jsx";
import RayosX from "./views/admin/panel-de-control/SistemaOcupacional/RayosX/RayosX.jsx";
import ConsentimientoInformadoOcupacional from "./views/admin/panel-de-control/SistemaOcupacional/ConsentimientoInformado/Consentimiento_informado_digitalizado.jsx";

//SIMULADOR DE jaspers
import Ficha from "./views/jaspers/RayosX/RagiografiaToraxPA_Digitalizado.jsx";

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <AppContent />
      </Router>
    </React.StrictMode>
  );
};

const AppContent = () => {
  const token = useAuthStore((state) => state.token);
  const userLogued = useAuthStore((state) => state.userlogued);
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);
  const setlistView = useAuthStore((state) => state.setlistView);
  const setListAccesos = useAuthStore((state) => state.setlistAccesos);
  //VISTA DE API
  const [TotalView, setTotalView] = useState([]);
  const location = useLocation();
  const showNavbarRoutes = ["/"];
  const isLoginPage = showNavbarRoutes.includes(location.pathname);
  const isHiddenRoute = [
    "/forgot-password",
    "/verificacion-codigo",
    "/actualizar-password",
    "/RegistroP",
    "/libro-de-reclamaciones",
  ].includes(location.pathname);
  const showBreadcrumb = !isLoginPage && !isHiddenRoute;

  useEffect(() => {
    if (isTokenExpired(token)) {
      setToken(null);
      setuserlogued(null);
      setlistView([]);
      setListAccesos([]);
    }
  }, [token]);

  useEffect(() => {
    // Supongamos que getFetch es una función para obtener datos de la API
    if (userLogued) {
      getFetch(`/api/v01/ct/opcionesInterfaz`, token)
        .then((res) => {
          setTotalView(res);
        })
        .catch(() => {
          console.log("Ocurrió un Error al traer los datos");
        });
      return;
    }
  }, [userLogued]);

  return (
    <>
      {!isHiddenRoute && !isLoginPage && <Navbar />}
      {showBreadcrumb && <Breadcrumb />}
      <Routes>
        <Route element={<ProtectedLogin />}>
          <Route path="/" element={<LoginPageAdmin />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/verificacion-codigo"
          element={<VerificationCodeInput />}
        />
        <Route path="/actualizar-password" element={<ActualizarPassword />} />

        <Route element={<ProtectedPanel />}>
          <Route
            path="/panel-de-control"
            element={<DashboardAdmin TotalView={TotalView} />}
          />
        </Route>

        <Route element={<ProtectedRoute TotalView={TotalView} />}>
          <Route path="/accesos" element={<Accesos />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/reporte-pacientes" element={<Reporte />} />
          <Route path="/matriz-postulante" element={<Matriz />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/agregar-sede" element={<AgregarSede />} />
          <Route path="/agregar-campaña" element={<AgregarCampaña />} />
          <Route path="/lista-archivos" element={<CreateArchivo />} />
          <Route
            path="/administrar-empresas"
            element={<AdministrarEmpresas />}
          />
          <Route
            path="/administrar-contratas"
            element={<AdministrarContratas />}
          />
          <Route path="/protocolos" element={<Protocolos />} />
          <Route path="/SistemaOcupacional" element={<SistemaOcupacional />} />
          <Route path="/odontologia" element={<Odontologia />} />
          <Route
            path="/SistemaOcupacional/odontologia"
            element={<Odontologia />}
          />
          <Route
            path="/HistoriaOcupacional"
            element={<HistoriaOcupacional />}
          />
          <Route path="/rayosx" element={<RayosX />} />
          <Route path="/consentimiento-informado" element={<ConsentimientoInformadoOcupacional />} />
        </Route>
        <Route path="/Espirometria" element={<Espirometria />} />
        <Route path="/Oftalmologia" element={<OftalmologiaTabSelector />} />
        <Route path="/musculoesqueletico" element={<MusculoEsqueleticoTabSelector />} />
        <Route path="/RegistroP" element={<Formulario />} />
        <Route
          path="/libro-de-reclamaciones"
          element={<LibroDeReclamaciones />}
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/fichapi" element={<Ficha />} />
      </Routes>
      {!isLoginPage && !isHiddenRoute && <Footer />}
    </>
  );
};

createRoot(document.getElementById("root")).render(<App />);
