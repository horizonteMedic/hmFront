import { URLAzure } from '../../../../config/config'
//Esto es para ver los archivos ya subidos del paciente
export function GetMatrizAdmin(datos, token) {

    const data = {
        rucContrata: datos.rucContrata,
        rucEmpresa: datos.rucEmpresa,
        fechaInicio: datos.fechaInicio,
        fechaFinal: datos.fechaFinal,
        sede: datos.sede
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/matrizAdministrativa`, options)
        .then(res => res.json()).then(response => response)
}

export function GetMatrizDoctor(datos, token) {

    const data = {
        rucContrata: datos.rucContrata,
        rucEmpresa: datos.rucEmpresa,
        fechaInicio: datos.fechaInicio,
        fechaFinal: datos.fechaFinal,
        sede: datos.sede
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/matrizSalud`, options)
        .then(res => res.json()).then(response => response)
}

export function GetMatrizArchivos(token) {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos`, options)
        .then(res => res.json()).then(response => response)
}

export function GetMatrizADMOHLA(datos, token) {

    const data = {
        rucContrata: datos.rucContrata,
        rucEmpresa: datos.rucEmpresa,
        fechaInicio: datos.fechaInicio,
        fechaFinal: datos.fechaFinal,
        sede: datos.sede
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/matrizAdministrativaOhla`, options)
        .then(res => res.json()).then(response => response)


}

export function GetMatrizSALUDOHLA(datos, token) {


    const data = {
        rucContrata: datos.rucContrata,
        rucEmpresa: datos.rucEmpresa,
        fechaInicio: datos.fechaInicio,
        fechaFinal: datos.fechaFinal,
        sede: datos.sede
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/matrizSaludOhla`, options)
        .then(res => res.json()).then(response => response)
}

export function GetMatrizGeneral(datos, token) {


    const data = {
        rucContrata: datos.rucContrata,
        rucEmpresa: datos.rucEmpresa,
        fechaInicio: datos.fechaInicio,
        fechaFinal: datos.fechaFinal,
        sede: datos.sede
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/matrizGeneral`, options)
        .then(res => res.json()).then(response => response)
}

export function GetMatrizUniversal(datos, config, token) {
    const { url, method } = config;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    if (method === "POST") {
        options.body = JSON.stringify({
            rucContrata: datos.rucContrata,
            rucEmpresa: datos.rucEmpresa,
            fechaInicio: datos.fechaInicio,
            fechaFinal: datos.fechaFinal,
            sede: datos.sede
        });
    }

    return fetch(`${URLAzure}/api/v01/${url}`, options)
        .then(res => res.json()).then(response => response)
}
