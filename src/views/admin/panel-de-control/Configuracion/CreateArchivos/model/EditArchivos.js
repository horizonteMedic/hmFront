import {URLAzure} from '../../../../../config/config'

export function EditArchivo (datosEditados, userRegistro, token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

  const data = {
    nombre: datosEditados.nombre,
    extension: datosEditados.extension,
    nomenclatura: datosEditados.nomenclatura,
    color: datosEditados.color,
    codigo: datosEditados.codigo,
    estado: datosEditados.estado,
    fechaRegistro: datosEditados.fechaRegistro,
    userRegistro: datosEditados.userRegistro,
    fechaActualizacion: `${year}-${month}-${day}`,
    userActualizacion: userRegistro
  };
  const url = `${URLAzure}/api/v01/ct/tipoArchivo/${datosEditados.id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
};


