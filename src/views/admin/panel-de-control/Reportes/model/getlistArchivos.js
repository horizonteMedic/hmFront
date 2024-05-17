import {URLAzure} from '../../../../config/config'

//Actualizacion, ahora busca por iduser los archivos habilitados
export function GetlistArchivos(token,id) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/tipoArchivo/listadoTiposArchivosPorIdUser/${id}`,options)
    .then(res => res.json()).then(response => response)
}

