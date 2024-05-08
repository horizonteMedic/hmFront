import {URLAzure} from '../../../../config/config'

export function registrarContrata (rucContrata, razonContrata, direccionContrata, telefonoContrata,responsableContrata, emailContrata, token) {

  const data = {
    rucContrata: rucContrata,
    razonContrata: razonContrata,
    direccionContrata: direccionContrata,
    telefonoContrata: telefonoContrata,
    responsableContrata: responsableContrata,
    emailContrata: emailContrata
  };

  const url = `${URLAzure}/api/v01/ct/contrata`
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

export function editContrata (id,  razonContrata, direccionContrata, telefonoContrata,responsableContrata, emailContrata, token) {

    const data = {
        razonContrata: razonContrata,
        direccionContrata: direccionContrata,
        telefonoContrata: telefonoContrata,
        responsableContrata: responsableContrata,
        emailContrata: emailContrata
    };
  
    const url = `${URLAzure}/api/v01/ct/contrata/${id}`
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

export function DeleteContrata (id, token) {

    const url = `${URLAzure}/api/v01/ct/contrata/${id}`
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
      return fetch(url,options).then(res => res.json()).then(response => response) 
  };
  
  


