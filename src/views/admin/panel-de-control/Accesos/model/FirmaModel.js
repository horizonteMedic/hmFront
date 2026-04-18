import { URLAzure } from "../../../../config/config";

export const getFirma = async (dni, token) => {
    const response = await fetch(`${URLAzure}/api/v01/st/registros/detalleArchivoEmpleado/${dni}/SELLOFIRMA`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        if (response.status === 404) {
            return { error: true, message: 'No se encontró firma' };
        }
        throw new Error('Error al obtener la firma');
    }
};

export const registrarFirma = async (dni, base64, nombreArchivo, token) => {
    const data = {
        id_empleado_tipo_doc: 1, // Según el ejemplo del usuario
        dni: parseInt(dni),
        tipoArchivo: "SELLOFIRMA",
        nombreArchivo: nombreArchivo,
        ruta: null,
        extension: ".jpg",
        base64: base64
    };

    const response = await fetch(`${URLAzure}/api/v01/st/registros/registrarArchivoEmpleado`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar la firma');
    }
};
