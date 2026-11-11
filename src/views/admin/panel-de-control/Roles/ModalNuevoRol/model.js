import { URLAzure } from "../../../../config/config";
import { leerRespuesta } from "../model/respuesta";

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Habilita una acción (permiso) de una vista para el rol.
export function NewPermiso(IDVIEW, NAME, IDROL, token) {
    const data = {
        idOpcionInterfaz: IDVIEW,
        namePermiso: NAME,
        idRol: IDROL
    };

    return fetch(`${URLAzure}/api/v01/ct/permisosAsignadosPorRol`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(data)
    }).then(leerRespuesta);
}

// Deshabilita una acción (permiso) de una vista para el rol.
export function DeletePermiso(IDVIEW, NAME, IDROL, token) {
    const query = new URLSearchParams({ idRol: IDROL, idOpcionInterfaz: IDVIEW, namePermiso: NAME });

    return fetch(`${URLAzure}/api/v01/ct/permisosAsignadosPorRol/eliminarPermisoAsignadoPorVistaYRol?${query}`, {
        method: 'DELETE',
        headers: headers(token)
    }).then(leerRespuesta);
}
