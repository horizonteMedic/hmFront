import {URLAzure} from '../../../../config/config'

export function GetlistArchivos(token) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/tipoArchivo/listadoArchivosHabilitados`,options)
    .then(res => res.json()).then(response => response)
}

