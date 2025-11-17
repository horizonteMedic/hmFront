import { URLAzure } from "../../../../../config/config";

export function SubmitHistoriaOcupacional(data,registros,user,token) {
    const body = {
        "codHo": data.codHo ? data.codHo : null,
        "norden": data.norden,
        "areaO": data.areaO,
        "fechaHo": data.fecha,
        "dniUser": data.dniUser,
        "dniPa": data.dni,
        "userRegistro": user,
        "codigosDetallesEliminar": data.codHo ? data.eliminados: null,
        "detalles": registros.map(reg => ({
            fecha: reg.fecha || '',
            empresa: reg.empresa || '',
            altitud: reg.altitud || '',
            actividad: reg.actividad || '',
            areaEmpresa: reg.areaEmpresa || '',
            ocupacion: reg.ocupacion || '',
            superficie: reg.superficie || '',
            socavon: reg.socavon || '',
            riesgo: reg.riesgo || '',
            proteccion: reg.proteccion || '',
            causaRetiro: reg.causaRetiro || '',
            historiaDetalleId: data.codHo ? reg.historiaDetalleId ?? null : null,
        }))
    };    

    const url = `${URLAzure}/api/v01/ct/historiaOcupacional/registrarActualizarHistoriaOcupacional`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        } 
        return res.json()
    }).then(response => response)
    .catch(error => {
        console.error('Error en SubmitHistoriaOcupacional:', error)
        throw error
    }) 
}