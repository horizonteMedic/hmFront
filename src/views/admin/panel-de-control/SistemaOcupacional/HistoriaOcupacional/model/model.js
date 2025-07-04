import { URLAzure } from "../../../../../config/config";

export function SubmitHistoriaOcupacional(data,registros,user,token) {
    const body = {
        "codHo": data.codHo ? data.codHo : 0,
        "norden": data.norden,
        "areaO": data.areaO,
        "fechaHo": data.fecha,
        "dniUser": 76574022,
        "dniPa": data.dni,
        "userRegistro": user,
        "detalles": registros.map(reg => ({
            fecha: reg.fecha || 'xd',
            empresa: reg.empresa || 'xd',
            altitud: reg.altitud || 'xd',
            actividad: reg.actividad || 'xd',
            areaEmpresa: reg.areaEmpresa || 'xd',
            ocupacion: reg.ocupacion || 'xd',
            superficie: reg.superficie || 'xd',
            socavon: reg.socavon || 'xd',
            riesgo: reg.riesgo || 'xd',
            proteccion: reg.proteccion || 'xd'
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
            return res
        } return res.json()}).then(response => response) 
}