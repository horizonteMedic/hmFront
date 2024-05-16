import { URLAzure } from "../../../../config/config";

export function editUser (datos, token) {

    const data = {
        username: datos.username,
        estado: datos.estado,
        id_empleado: datos.id_empleado
    };
  
    const url = `${URLAzure}/api/v01/ct/usuario/actualizacionParcial/${datos.id}`
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