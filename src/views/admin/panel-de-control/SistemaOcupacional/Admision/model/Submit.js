import { URLAzure } from "../../../../../config/config.js"

export function Submit(datos) {
 
    const data = {
        id_empleado_tipo_doc: null,
        dni: datos.dni,
        tipoArchivo: datos.tipoA,
        nombreArchivo: datos.nombre,
        ruta: null,
        extension: ".png",
        base64: datos.base64
    }

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/st/registros/registrarArchivoEmpleado`,options)
    .then(res => res.json()).then(response => response)
}

export function VerifyHoF(url) {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    return fetch(URLAzure+url,options).then(res => res.json()).then(response => response) 
}