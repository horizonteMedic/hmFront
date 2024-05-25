import {URLAzure} from '../../../../config/config'

export function GetListREport(user,fechai,fechaf,sede,rucEmpresa,rucContrata,token, abort = {}) {
    const {signal } = abort
    const data = {
        userName: user,
        fechaInicio: fechai,
        fechaFin: fechaf,
        sedeUser: sede,
        rucEmpresa: rucEmpresa,
        rucContrata: rucContrata
    }
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        signal,
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/listadoHistorialPacientesConFiltros`,options)
    .then(response => 
        {if (!response.ok) {
            throw new Error('');
          }
          return response.json();}
    ).then(response => response)
}

