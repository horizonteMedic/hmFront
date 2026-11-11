import {URLAzure} from '../../../../config/config'
//Esto es para ver los archivos ya subidos del paciente
// remoto: true cuando el paciente viene de un servidor remoto (query opcional, por defecto false)
export function GetArchivosSubidos(historia,id,token,remoto = false) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos/busquedaPorHC/${historia}/${id}${remoto ? '?remoto=true' : ''}`,options)
    .then(res => res.json()).then(response => response)
}

