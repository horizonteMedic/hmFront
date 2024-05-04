const registrarArchivo = async (nombre, extension, color, codigo, estado, fechaRegistro, userRegistro, token) => {
  const data = {
    nombre: nombre,
    extension: extension,
    color: color,
    codigo: codigo,
    estado: estado,
    fechaRegistro: `${year}-${month}-${day}`,
    userRegistro: userRegistro,
    fechaActualizacion: null,
    userActualizacion: null
  };

  try {
    const response = await fetch('your_api_url_here', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear el archivo.');
    }

    return await response.json(); // Devuelve la respuesta como JSON
  } catch (error) {
    throw new Error(error.message); // Propaga el error para que sea manejado por quien llama a esta función
  }
};

export default registrarArchivo;
