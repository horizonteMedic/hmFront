import { URLAzure } from "../../../../config/config"

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

//BorrarUsuarios
function DeleteUsers(ID, token) {
    
    const url = `${URLAzure}/api/v01/ct/usuario/${ID}`
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
}

export {ListUser,ListEmpleadoDNI,DeleteUsers}
