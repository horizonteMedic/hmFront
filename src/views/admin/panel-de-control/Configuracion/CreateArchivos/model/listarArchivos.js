export function getListArchivos(token) {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  
    return fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/tipoArchivo', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los archivos');
        }
        return response.json();
      })
      .then(data => data)
      .catch(error => {
        console.error('Error al obtener los archivos:', error);
        return [];
      });
  }
  