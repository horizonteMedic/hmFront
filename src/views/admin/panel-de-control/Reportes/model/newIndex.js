import { URLAzure } from "../../../../config/config";

export default async function NewIndex(user,cantidad,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    let hours = currentDate.getHours();
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convierte a formato de 12 horas

    const localTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const data = {
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
        horaRegistro: localTime,
        cantidadArchivos: cantidad
    }

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/respBack/registrarIndiceCargaMasiva`,options)
    .then(res => res.json()).then(response => response)
        
    }

    


