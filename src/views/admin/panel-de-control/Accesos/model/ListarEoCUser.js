import { URLAzure } from "../../../../config/config"

export function ListEoCUsername(id_user, token) {
    console.log(id_user)
    const url = `${URLAzure}/api/v01/ct/sistemaArchivos/listadoEmpContIdUser/${id_user}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}