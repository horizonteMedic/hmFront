import { URLAzure } from "../../../../config/config";

export function NewPermiso(IDVIEW,NAME,IDROL,token) {

    const data = {
        idOpcionInterfaz: IDVIEW,
        namePermiso: NAME,
        idRol: IDROL
    }
    console.log(data)
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }
    return fetch(`${URLAzure}/api/v01/ct/permisosAsignadosPorRol`,options)
    .then(res => res.json()).then(response => response)
        
    }

export function DeletePermiso(IDVIEW,NAME,IDROL,token) {
    console.log(IDROL)
    const options = {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

    }
    return fetch(`${URLAzure}/api/v01/ct/permisosAsignadosPorRol/eliminarPermisoAsignadoPorVistaYRol?idRol=${IDROL}&idOpcionInterfaz=${IDVIEW}&namePermiso=${NAME}`,options)
    .then(res => res.json()).then(response => response)
        
    }