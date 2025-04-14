import {URLAzure} from '../../../../../config/config'


//Editar Protocolo
export function EditarProtocolos (datos, user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
   
  const data = {
    nombreProtocolo: datos.nombreProtocolo,
    rucEmpresa: datos.rucEmpresa,
    precio: datos.precio,
    observacion: "sin observaciones",
    estado: true,
    fechaRegistro: datos.fecha,
    userRegistro: datos.user,
    fechaActualizacion: `${year}-${month}-${day}`,
    userActualizacion: user
  };    

  const url = `${URLAzure}/api/v01/ct/ocupacional/protocolos/${datos.id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 
};

//Editar Servicio-Protocolo
export function EditarServicioProtoclo (datos, user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
   
  const data = {
    id_protocolo: datos.id_protocolo,
    id_servicio: datos.id_servicio,
    precio: datos.precio,
    fechaRegistro: datos.fecha,
    userRegistro: datos.user,
    fechaActualizacion: `${year}-${month}-${day}`,
    userActualizacion: user
  };     

  const url = `${URLAzure}/api/v01/ct/ocupacional/servicioProtocolos/${datos.id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 
};

//Editar Contrata-Protocolo
export function EditarContrataProtoclo (datos, user,token) {

  const currentDate = new Date(); // Obtiene la fecha y hora actual
  const year = currentDate.getFullYear(); // Obtiene el año actual
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
  const day = ('0' + currentDate.getDate()).slice(-2); 
 
const data = {
  id_protocolo: datos.id_protocolo,
  rucContrata: datos.rucContrata,
  precio: datos.precio,
  fechaRegistro: datos.fecha,
  userRegistro: datos.user,
  fechaActualizacion: `${year}-${month}-${day}`,
  userActualizacion: user
};     

const url = `${URLAzure}/api/v01/ct/ocupacional/contrataProtocolos/${datos.id}`
  const options = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
  }
  return fetch(url,options).then(res =>  {
      if (!res.ok) {
          return res
      } return res.json()}).then(response => response) 
};