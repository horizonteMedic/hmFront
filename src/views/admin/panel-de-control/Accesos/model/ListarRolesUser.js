import { URLAzure } from "../../../../config/config";

export function ListRolesxUsername(id_user, token) {
    const url = `${URLAzure}/api/v01/ct/rol/busquedaRolesPorIdUser/${id_user}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}

export function DeleteRolUser(id_rol,token) {
    console.log(id_rol)
    //Primero buscara la asignacion por el idROL
    const url = `${URLAzure}/api/v01/ct/privilegioRol/busquedaPorIdRol/${id_rol}`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => {console.log(response)}) 
    
}