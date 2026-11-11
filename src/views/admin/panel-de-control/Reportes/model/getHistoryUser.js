import {URLAzure} from '../../../../config/config'

export function GetHistoryUser(user,fechai,fechaf,sede,dniUser,empresa,contrata,token,remoto = false) {
    const data = {
        userName: user,
        fechaInicio: fechai,
        fechaFin: fechaf,
        sedeUser: sede,
        dniUser: dniUser,
        rucEmpresa: empresa,
        rucContrata: contrata,
        remoto: remoto
    }
 
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/sistemaArchivos/detalleListadoHistorialPacientesConFiltros`,options)
    .then(res => res.json()).then(response => response) 
}

