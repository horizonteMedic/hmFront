import {useAuthStore} from '../../store/auth'
import { useLocation,Outlet, Navigate} from "react-router-dom"

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
    //console.log(TotalView)
    //console.log(listView)
    
    
    if (setToken === null) {
        return <Navigate to="/" />;
      }

    const currentView = TotalView?.find(view => view.rutaVista === location.pathname);
    const isAccessAllowed = currentView && listView.some(view => view.id === currentView.id);
    //console.log(isAccessAllowed)
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

