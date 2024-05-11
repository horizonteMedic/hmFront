import { URLAzure } from "../../../../config/config";

export function ListViewxRol(id,token) {
    const URL = `${URLAzure}/api/v01/ct/privilegioRol/busquedaPorIdRol/${id}`
    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(URL,options)
    .then(res => res.json()).then(response => response)
}

export function NewVistaxRol(datos,user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        descripcion: datos.descripcion,
        estado: true,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
        fechaActualizacion: null,
        userActualizacion: null,
        id_rol: datos.id_rol,
        id_opcion_interfaz: datos.id_opcion_interfaz
    }
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/privilegioRol`,options)
    .then(res => res.json()).then(response => response)
        
    }

export function DeleteVistaxRol(id,token) {

        const options = {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        return fetch(`${URLAzure}/api/v01/ct/privilegioRol/${id}`,options)
        .then(res => res.json()).then(response => response)
            
        }