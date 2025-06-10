import { URLAzure } from "../../../../../../../config/config";

export function SubmitNewContrata(data,token) {

    const body = {
        rucContrata: data.rucContrata,
        razonContrata: data.razonContrata,
        direccionContrata: data.direccionContrata,
        telefonoContrata: data.telefonoContrata,
        responsableContrata: data.responsableContrata,
        emailContrata: data.emailContrata,
        apiToken: data.apiToken
    };    
  
    const url = `${URLAzure}/api/v01/ct/Contr`
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
      }
      return fetch(url,options).then(res =>  {
          if (!res.ok) {
              return res
          } return res.json()}).then(response => response) 
  
  }