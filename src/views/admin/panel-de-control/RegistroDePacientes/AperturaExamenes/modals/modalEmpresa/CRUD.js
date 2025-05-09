import { URLAzure } from "../../../../../../config/config";

export function SubmitNewEmpresa(data,token) {

    const body = {
        rucEmpresa: data.rucEmpresa,
        razonEmpresa: data.razonEmpresa,
        direccionEmpresa: data.direccionEmpresa,
        telefonoEmpresa: data.telefonoEmpresa,
        responsableEmpresa: data.responsableEmpresa,
        emailEmpresa: data.emailEmpresa,
        apiToken: data.apiToken
    };    

  
    const url = `${URLAzure}/api/v01/ct/infoAdmisionEmpresa`
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