import {useAuthStore} from '../../store/auth'
import { Outlet, Navigate} from "react-router-dom"

export default function ProtectedRoute(){
    const setToken = useAuthStore(state => state.token)
    
    return setToken !== null ? <Outlet/> : <Navigate to="/"/>
}