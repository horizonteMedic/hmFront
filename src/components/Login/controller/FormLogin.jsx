import { useState } from "react";
import SubmitLogin from '../model/SubmitLogin'
import EstadoSolicitud  from './EstadoLogin'
import {useAuthStore} from '../../../store/auth' //Estado global para el token

export function FormLogin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sede, setSede] = useState('');
    const [estado, setEstado] = useState('');
    
    const setToken = useAuthStore(state => state.setToken)

    const handleSubmit = (event) => {
        event.preventDefault(); // Evitar que la página se recargue

        SubmitLogin(username, password)
        .then(data => {
            setEstado(data.estado)
            setToken(data.estado) //Guarda el token en el local storage
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
    }
  
    return(
        <>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full" >
           <select name="" id="" className="w-full mb-5 p-4 rounded-full text-sm text-zinc-700 bg-white" onChange={(e) => setSede(e.target.value)}>
                <option value="Primera sede">Primera sede</option>
                <option value="Segunda sede">Segunda sede</option>
                <option value="Tercera sede">Tercera sede</option>
                <option value="Cuarta sede">Cuarta sede</option>
            </select>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className='w-full mb-5 p-4 rounded-full text-sm text-zinc-700 bg-white' />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full mb-5 p-4 rounded-full text-sm text-zinc-700 bg-white' />
            <button className=" bg-green-700  px-10 py-2 rounded-full" type="submit">Login</button>
        </form>
        {estado && EstadoSolicitud(estado)}
        </>
    )
}

export default FormLogin