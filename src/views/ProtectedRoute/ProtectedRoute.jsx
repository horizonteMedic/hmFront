import {useAuthStore} from '../../store/auth'
import { Outlet, Navigate} from "react-router-dom"

export function ProtectedRoute(){
    const setToken = useAuthStore(state => state.token)
    
    return setToken !== null ? <Outlet/> : <Navigate to="/"/>
}

export function ProtectedLogin() {
    const setToken = useAuthStore(state => state.token)
    
    return setToken !== null ? <Navigate to="/panel-de-control"/> : <Outlet/>

}

