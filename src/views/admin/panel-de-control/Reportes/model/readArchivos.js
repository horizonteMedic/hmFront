import {URLAzure} from '../../../../config/config'
//Esto es para ver los archivos ya subidos del paciente
// remoto: true cuando el paciente viene de un servidor remoto; se envía como ?remoto=true
export function ReadArchivos(historia,id_archivo,token,remoto = false) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos/detalleArchivo/${historia}/${id_archivo}${remoto ? '?remoto=true' : ''}`,options)
    .then(res => res.json()).then(response => response)
}

//Esto es para eliminar los archivos ya subidos del paciente
export function DeleteArchivos64(id_archivo,token) {

    const options = {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos/${id_archivo}`,options)
    .then(res => res.json()).then(response => response)
}
