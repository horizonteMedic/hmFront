import { useState } from "react";
import SubmitLogin from '../model/SubmitLogin'
import EstadoSolicitud  from './EstadoLogin'
import {useAuthStore} from '../../../../store/auth' //Estado global para el token
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';

export function FormLogin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sede, setSede] = useState('');
    const [estado, setEstado] = useState('');
    const navigate = useNavigate()
    const setToken = useAuthStore(state => state.setToken)
    

    function Loginvnigate(token) {
        if (token !== null) {
            navigate('/dashboard')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Evitar que la página se recargue

        SubmitLogin(username, password)
        .then(data => {
            setEstado(data.estado)
            setToken(data.token) //Guarda el token en el local storage
            Loginvnigate(data.token)
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
        
    }
  
    return(
        <>

<form onSubmit={handleSubmit} autoComplete="off">
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input type="text" className="form-control" placeholder='Tu Usuario' autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">
          Password
          <span className="form-label-description">
            <a href="./forgot-password.html">Olvide mi contraseña</a>
          </span>
        </label>
        <div className="input-group left-0 input-group-flat">
          <input type="password" className="form-control" placeholder="Tu password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="input-group-text">
            <a href="#" className="link-secondary" title="Show password" data-bs-toggle="tooltip">
              {/* agregar iconos */}
              <FontAwesomeIcon icon={faEye} />            
            </a>
          </span>
        </div>
      </div>
      <div className="mb-2">
        <label className="form-check">
          <input type="checkbox" className="form-check-input" />
          <span className="form-check-label">Remember me on this device</span>
        </label>
      </div>
      <div className="form-footer">
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
      </div>
    </form>
    {estado && EstadoSolicitud(estado)}
        </>
    )
}

export default FormLogin