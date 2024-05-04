import { URLAzure } from "../../../../config/config";


const registrarArchivo = async (nombre, extension, color, codigo, estado, fechaRegistro, userRegistro, token) => {
  const data = {
    nombre: nombre,
    extension: extension,
    color: color,
    codigo: codigo,
    estado: estado,
    fechaRegistro: fechaRegistro,
    userRegistro: userRegistro,
    fechaActualizacion: null,
    userActualizacion: null
  };

  try {
    const response = await fetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/tipoArchivo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear el archivo.');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message); 
  }
};

export default registrarArchivo;
