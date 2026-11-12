import {URLAzure} from '../../../../config/config'
//Esto es para ver los archivos ya subidos del paciente
// remoto: true cuando el paciente viene de un servidor remoto; se envía como ?remoto=true
export function ReadArchivos(historia,id_archivo,token,remoto = false) {

    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(`${URLAzure}/api/v01/ct/archivos/detalleArchivo/${historia}/${id_archivo}${remoto ? '?remoto=true' : ''}`,options)
    .then(res => res.json()).then(response => response)
}

//Esto es para eliminar los archivos ya subidos del paciente
// El backend responde texto plano (no JSON), así que se lee como texto y se valida el status HTTP.
// Si falla, lanza un Error con el mensaje más útil disponible.
export async function DeleteArchivos64(id_archivo,token) {

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    let res;
    try {
        res = await fetch(`${URLAzure}/api/v01/ct/archivos/${id_archivo}`,options);
    } catch {
        throw new Error('No se pudo conectar con el servidor. Revise su conexión e inténtelo de nuevo.');
    }

    const texto = await res.text().catch(() => '');
    if (!res.ok) {
        let mensaje = texto;
        try {
            const json = JSON.parse(texto);
            mensaje = json.mensaje || json.message || json.error || texto;
        } catch { /* la respuesta no era JSON */ }
        if (res.status === 401 || res.status === 403) mensaje = 'No tiene autorización para eliminar este archivo o su sesión expiró.';
        else if (res.status === 404) mensaje = 'El archivo ya no existe o fue eliminado previamente.';
        throw new Error(mensaje || `El servidor respondió con error ${res.status}.`);
    }
    return texto;
}
