import { URLAzure } from "../../../../config/config";
//Sirve para subir los archivos base64 al sistemas
export default async function NewArchivo(nombre,dni,historiaClinica,orden,id_tipo_archivo,user,token,fileBase64) {

    const base64WithoutHeader = fileBase64.substring(fileBase64.indexOf(',') + 1);

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        rutaArchivo: null,
        nombreArchivo: nombre,
        dni: dni,
        historiaClinica:historiaClinica,
        orden: orden,
        servidor: "azure",
        estado: false,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
       fechaActualizacion: null,
       userActualizacion: null,
       id_tipo_archivo: id_tipo_archivo,
       fileBase64: base64WithoutHeader
    }
    console.log(JSON.stringify(data))
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/archivos/registrarArchivo`,options)
    .then(res => res.json()).then(response => response)
        
    }

    


