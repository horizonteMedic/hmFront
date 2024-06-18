import {URLAzure} from '../../../../../config/config'

//API 12
export function registrarProtocolos (datos, user,token) {

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
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: user,
    fechaActualizacion: null,
    userActualizacion: null
  };    

  const url = `${URLAzure}/api/v01/ct/ocupacional/protocolos`
    const options = {
        method: 'POST',
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

//Registrar Servicios_Protocolos
export function registrarProtocolosServicios (datos, user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

  const data = {
    id_protocolo: datos.id_protocolo,
    id_servicio: datos.id_servicio,
    precio: datos.precio,
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: user,
    fechaActualizacion: null,
    userActualizacion: null
  };    

  const url = `${URLAzure}/api/v01/ct/ocupacional/servicioProtocolos`
    const options = {
        method: 'POST',
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

//Registrar ContratasProtocolos
export function registrarProtocolosContratas (datos, user,token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 

  const data = {
    id_protocolo: datos.id_protocolo,
    rucContrata: datos.rucContrata,
    precio: datos.precio,
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: user,
    fechaActualizacion: null,
    userActualizacion: null
  };    

  const url = `${URLAzure}/api/v01/ct/ocupacional/contrataProtocolos`
    const options = {
        method: 'POST',
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

//Eliminar Protocolos
export function DeleteProtocolo (id,token){

  const url = `${URLAzure}/api/v01/ct/ocupacional/protocolos/${id}`
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 
}

//Eliminar ContrataProtocolo
export function DeleteContrataProtocolo (id,token){

    const url = `${URLAzure}/api/v01/ct/ocupacional/contrataProtocolos/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res =>  {
          if (!res.ok) {
              return res
          } return res.json()}).then(response => response) 
  }

//Eliminar Servicio Protocolo
export function DeleteServicioProtocolo (id,token){

    const url = `${URLAzure}/api/v01/ct/ocupacional/servicioProtocolos/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res =>  {
        console.log(res)
          if (!res.ok) {
              return res
          } return res.json()}).then(response => response) 
  }



export function editServicio (datos, user, token) {

    const currentDate = new Date(); // Obtiene la fecha y hora actual
    const year = currentDate.getFullYear(); // Obtiene el año actual
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Obtiene el mes actual y le agrega un 0 al principio si es menor a 10
    const day = ('0' + currentDate.getDate()).slice(-2); 
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
  
  


