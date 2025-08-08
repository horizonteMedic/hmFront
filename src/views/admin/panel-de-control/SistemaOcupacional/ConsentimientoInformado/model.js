import { URLAzure } from "../../../../config/config";

export function SubmitConsentimientoInformado(data,user,token) {
    const body = {
        "norden": data.norden,
        "fecha": data.fecha,
        "hora": data.horaActual.replace(/[^0-9:]/g, ""),
        "userRegistro": user
    };    

    const url = `${URLAzure}/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoInformado`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
    }
    return fetch(url,options).then(res =>  {
        if (!res.ok) {
            return res
        } return res.json()}).then(response => response) 
}