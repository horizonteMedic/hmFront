
export function ListUser(id, token) {
    
    const url = `https://servicios-web-hm.azurewebsites.net/api/v01/ct/usuario/busquedaIdEmpleado/${id}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}