import { URLAzure } from "../../../../config/config";

export function AsignarSedexUsuario(id_user,id_sede,user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    
    const data = {
        id_user: id_user,
        id_sede: id_sede,
        userRegistro: user,
        fechaRegistro: `${year}-${month}-${day}`
    }
    const url = `${URLAzure}/api/v01/ct/usuarioSede`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
        
}