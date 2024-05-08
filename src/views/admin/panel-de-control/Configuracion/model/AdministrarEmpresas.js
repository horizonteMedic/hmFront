import {URLAzure} from '../../../../config/config'

export function registrarEmpresa (rucEmpresa, razonEmpresa, direccionEmpresa, telefonoEmpresa,responsableEmpresa, emailEmpresa, token) {

  const data = {
    rucEmpresa: rucEmpresa,
    razonEmpresa: razonEmpresa,
    direccionEmpresa: direccionEmpresa,
    telefonoEmpresa: telefonoEmpresa,
    responsableEmpresa: responsableEmpresa,
    emailEmpresa: emailEmpresa,
    apiToken: null
  };

  const url = `${URLAzure}/api/v01/ct/empresa`
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

export function editEmpresa (id, razonEmpresa, direccionEmpresa, telefonoEmpresa, responsableEmpresa, emailEmpresa, token) {

    const data = {
      razonEmpresa: razonEmpresa,
      direccionEmpresa: direccionEmpresa,
      telefonoEmpresa: telefonoEmpresa,
      responsableEmpresa: responsableEmpresa,
      emailEmpresa: emailEmpresa,
      apiToken: null
    };
  
    const url = `${URLAzure}/api/v01/ct/empresa/${id}`
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

export function DeleteEmpresa (id, token) {

    const url = `${URLAzure}/api/v01/ct/empresa/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => res.json()).then(response => response) 
  };
  
  


