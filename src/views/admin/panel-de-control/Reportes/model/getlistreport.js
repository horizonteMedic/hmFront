import { json } from 'react-router-dom'
import {URLAzure} from '../../../../config/config'

export function GetListREport(user,fechai,fechaf,sede,rucEmpresa,rucContrata,token) {
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
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/listadoHistorialPacientesConFiltros`,options)
    .then(res => res.json()).then(response => response)
}

