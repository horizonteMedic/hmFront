import {URLAzure} from '../../../../config/config'

//API 11
export function registrarServicio (datos, user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 


  const data = {
    nombreServicio: datos.nombreServicio,
    tablaServicio: datos.tablaServicio,
    precio: datos.precio,
    estado: true,
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: user,
    fechaActualizacion: null,
    userActualizacion: null
  };    
  console.log(JSON.stringify(data))

  const url = `${URLAzure}/api/v01/ct/ocupacional/servicios`
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

export function editServicio (datos, user, token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
    console.log(datos)
    const data = {
        nombreServicio: datos.nombreServicio,
        tablaServicio: datos.tablaServicio,
        precio: datos.precio,
        estado: datos.estado,
        fechaRegistro: datos.fechaRegistro,
        userRegistro: datos.userRegistro,
        fechaActualizacion: `${year}-${month}-${day}`,
        userActualizacion: user
    };
    console.log(JSON.stringify(data))
    const url = `${URLAzure}/api/v01/ct/ocupacional/servicios/${datos.id}`
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

export function DeleteServicio (id, token) {
   
    const url = `${URLAzure}/api/v01/ct/ocupacional/servicios/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => 
        {if (!res.ok) {
            return res.status
      }return res.status}).then(response => response) 
  };
  
  


