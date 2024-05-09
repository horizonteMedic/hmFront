import {URLAzure} from '../../../../config/config'

export function registrarSede (datos, token,user) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

  const data = {
    nombreSede: datos.nombre,
    codigoSede: datos.codigo,
    estado: datos.estado,
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: user,
    fechaActualizacion: null,
    userActualizacion: null 
  };
  
  const url = `${URLAzure}/api/v01/ct/sede`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
};

export function editSede (sede, token) {

    const data = {
        razonContrata: razonContrata,
        direccionContrata: direccionContrata,
        telefonoContrata: telefonoContrata,
        responsableContrata: responsableContrata,
        emailContrata: emailContrata
    };
  
    const url = `${URLAzure}/api//v01/ct/sede/${id}`
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

export function DeleteSede (id, token) {

    const url = `${URLAzure}/api//v01/ct/sede/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => res.json()).then(response => response) 
  };
  
  


