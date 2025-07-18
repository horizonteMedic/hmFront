import {useAuthStore} from '../../store/auth'
import { useLocation,Outlet, Navigate} from "react-router-dom"

/*MAINconst protectedRoutes = {
    '/roles': 52,
    '/accesos': 53,
    '/reporte-pacientes': 54,
    '/matriz-postulante': 55,
    '/configuracion': 56,
    '/lista-archivos': 57,
    '/agregar-sede': 58,
    '/agregar-campa%C3%B1a': 59,
    '/administrar-empresas': 60,
    '/administrar-contratas': 61,
    '/protocolos': 61,
    '/RegistroP': 602,
    '/Registro-de-pacientes': 202
  };
  
  DESARROLLO
  const protectedRoutes = {
    '/roles': 2,
    '/accesos': 53,
    '/reporte-pacientes': 54,
    '/matriz-postulante': 55,
    '/configuracion': 53,
    '/lista-archivos': 57,
    '/agregar-sede': 58,
    '/agregar-campa%C3%B1a': 59,
    '/administrar-empresas': 60,
    '/administrar-contratas': 61,
    '/protocolos': 61,
    '/RegistroP': 602,
    '/Registro-de-pacientes': 3
  }; */

  const protectedRoutes = {
    '/roles': "Menú de Roles",
    '/accesos': "Menú de Accesos",
    '/reporte-pacientes': "Reportes",
    '/matriz-postulante': "Matriz Postulante",
    '/configuracion': "Configuracion",
    '/lista-archivos': "Administrar Archivos",
    '/agregar-sede': "Administrar Sedes",
    '/agregar-campa%C3%B1a': 59,
    '/administrar-empresas': "Administrar Empresas",
    '/administrar-contratas': "Administrar Contratas",
    '/protocolos': "Servicios",
    '/RegistroP': 602,
    '/SistemaOcupacional': "Modulo Ocupacional",
    '/odontologia': "Odontología",
    '/rayosx': "Rayos X",
  };

export function ProtectedRoute() {
    const listView = useAuthStore(state => state.listView);
    const token = useAuthStore(state => state.token);
    const location = useLocation();

    if (token === null) {
      return <Navigate to="/" />;
    }

    const isRouteAllowed = (route) => {
      if (route === "/HistoriaOcupacional" || route === "/odontologia" || route === "/rayosx") return true;
      const routeName = protectedRoutes[route];
      return listView.includes(routeName);
    };
    
    const isAccessAllowed = isRouteAllowed(location.pathname);
    console.log(isAccessAllowed)
    return isAccessAllowed ? <Outlet /> : <Navigate to="/panel-de-control" />;
}

export function ProtectedPanel() {
    const setToken = useAuthStore(state => state.token)

    return setToken !== null ? <Outlet/> : <Navigate to="/"/>
}

export function ProtectedLogin() {
    const setToken = useAuthStore(state => state.token)
    
    return setToken !== null ? <Navigate to="/panel-de-control"/> : <Outlet/>

}

export function ProtectedRegister() {
    const listView = useAuthStore(state => state.listView)


}

