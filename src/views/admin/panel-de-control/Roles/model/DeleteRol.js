import { URLAzure } from "../../../../config/config";

//El rol no se borra, solo se pone su estado en false
export default async function DeleteRol(id,rol,descripcion,fecharegistro,userRegistro,token,userlogued){

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

    const data = {
        nombre: rol,
        estado: false,
        fechaRegistro: fecharegistro,
        userRegistro: userRegistro,
        fechaActualizacion: `${year}-${month}-${day}`,
        userActualizacion: userlogued,
        descripcion: descripcion
    }
    const response = await fetch(`${URLAzure}/api/v01/ct/rol/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)

        })
        if(response.ok){
            return
        } else {
            throw new Error('Network response was not ok.');
        }

}