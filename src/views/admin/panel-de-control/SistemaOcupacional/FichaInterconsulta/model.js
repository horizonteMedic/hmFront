import { URLAzure } from "../../../../config/config";

export function SubirInterconsulta(datos,user,token) {


    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        rutaArchivo: null,
        nombreArchivo: datos.nombre,
        codigoSede: datos.sede,
        dni: null,
        historiaClinica:null,
        orden: datos.norden,
        servidor: "azure",
        estado: true,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
       fechaActualizacion: null,
       userActualizacion: null,
       id_tipo_archivo: null,
       nomenclatura_tipo_archivo: datos.nomenclatura,
       indice_carga_masiva:datos.indice,
       fileBase64: datos.base64
    }

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/archivos/archivoInterconsulta`,options)
    .then(res => res.json()).then(response => response)
        
    }

export function ReadArchivos(norden,nomenclatura,token) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return fetch(`${URLAzure}/api/v01/st/registros/detalleUrlArchivos/${norden}/${nomenclatura}`,options)
    .then(res => res.json()).then(response => response)
}

