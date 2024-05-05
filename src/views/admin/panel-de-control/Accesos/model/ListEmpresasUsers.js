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