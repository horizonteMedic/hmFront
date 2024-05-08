import { URLAzure } from "../../../../../config/config"

export function DeleteArchivo (id, token) {

    const url = `${URLAzure}/api/v01/ct/tipoArchivo/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => res.json()).then(response => response) 
  };
  