import { URLAzure } from "../../../../config/config";
import { leerRespuesta } from "./respuesta";

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Vistas (privilegios) asignadas a un rol: [{ id, id_opcion_interfaz, ... }]
export function ListViewxRol(id, token) {
    return fetch(`${URLAzure}/api/v01/ct/privilegioRol/busquedaPorIdRol/${id}`, {
        method: 'GET',
        headers: headers(token)
    }).then(leerRespuesta);
}

// Asigna una vista al rol.
export function NewVistaxRol(datos, user, token) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const data = {
        descripcion: datos.descripcion,
        estado: true,
        fechaRegistro: `${year}-${month}-${day}`,
        userRegistro: user,
        fechaActualizacion: null,
        userActualizacion: null,
        id_rol: datos.id_rol,
        id_opcion_interfaz: datos.id_opcion_interfaz
    };

    return fetch(`${URLAzure}/api/v01/ct/privilegioRol`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(data)
    }).then(leerRespuesta);
}

// Quita la vista del rol (`id` = id del privilegio, no de la vista).
export function DeleteVistaxRol(id, token) {
    return fetch(`${URLAzure}/api/v01/ct/privilegioRol/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    }).then(leerRespuesta);
}
