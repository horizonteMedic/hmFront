import {URLAzure} from '../../../../config/config'
//Esto es para ver los archivos ya subidos del paciente
export function ReadArchivos(historia,id_archivo,token) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos/detalleArchivo/${historia}/${id_archivo}`,options)
    .then(res => res.json()).then(response => response)
}

