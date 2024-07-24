import { URLAzure, URLAPIREST, TokenURL } from "../../../config/config"
//12.17

export function SearchPacienteDNI(dni,token) {
  
    const url = `${URLAzure}/api/v01/ct/registroPacientes/datosPaciente/T-NP/${dni}`
      const options = {
          method: 'GET',
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

export function SearchPacienteDNIAPIREST(dni) {
    
    const url = `${URLAzure}/api/v01/st/registros/consumoApis/${dni}`
      const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      }
      return fetch(url,options).then(res =>  {
        console.log(res,1)
          if (!res.ok) {
              return res
          } return res.json()}).then(response => response) 
  }
