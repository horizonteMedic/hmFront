import { URLAzure } from "../../../../config/config"

//Mira todos los Usuarios de un empleado
function ListUser(id, token) {
    
    const url = `${URLAzure}/api/v01/ct/usuario/busquedaIdEmpleado/${id}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}

//FUnciona para registrar un nuevo usuario, esta funcion permite ver a los empleados por su DNI
function ListEmpleadoDNI(DNI, token) {
    
    const url = `${URLAzure}/api/v01/st/empleado/busquedaPorNroDoc/${DNI}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}

//BorrarUsuarios -- Desabilitarlos
function DeleteUsers(ID, user,idempleado,token) {
    
    const data = {
        username: user,
        estado: false,
        id_empleado: idempleado
    }
    
    const url = `${URLAzure}/api/v01/ct/usuario/${ID}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
}

export {ListUser,ListEmpleadoDNI,DeleteUsers}
