import {URLAzure} from '../../../../../config/config'

//API 12
export function BusquedaServicio (id,token) {


  const url = `${URLAzure}/api/v01/ct/ocupacional/servicioProtocolos/busquedaPorIdProtocolo/${id}`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    return fetch(url,options).then(res => res.json()).then(response => response) 
};

export function BusquedaContrata (id,token) {


    const url = `${URLAzure}/api/v01/ct/ocupacional/contrataProtocolos/busquedaIdProtocolo/${id}`
      const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => res.json()).then(response => response) 
  };
  
