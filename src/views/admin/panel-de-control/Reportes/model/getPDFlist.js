import {URLAzure} from '../../../../config/config'

//Actualizacion, ahora busca por iduser los archivos habilitados
export function GetlistPDF(token,indice) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(`${URLAzure}/api/v01/ct/archivos/listadoArchivosCargaMasivaPorIndice/${indice}`,options)
    .then(res => res.json()).then(response => response)
}

