import { URLAzure } from "../../../../../config/config";

//12.43
export function SubmitDetalleCita(data,token) {

    const body = {
        nombreSede: data.nomensede,
        fechaReserva: data.fechaReserva,
        nombreUser: data.usuario
    };    

  
    const url = `${URLAzure}/api/v01/ct/ocupacional/citaOcupacional/detalleReserva`
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