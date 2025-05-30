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

export function ProtectedRoute({TotalView}){
      const listView = useAuthStore(state => state.listView)
    const setToken = useAuthStore(state => state.token)
    const location = useLocation();
    if (setToken === null) {
        return <Navigate to="/" />;
      }
    
    const isRouteAllowed = (route) => {
        const routeId = protectedRoutes[route];
        return listView.some(view => view.id === routeId);
    };
    
    const isAccessAllowed = isRouteAllowed(location.pathname);
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

