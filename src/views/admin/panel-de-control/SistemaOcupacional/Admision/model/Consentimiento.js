import { URLAzure } from "../../../../../config/config"

export function GetNoConsentimiento(norden,tabla,token) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    
    return fetch(URLAzure+`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${norden}&nomService=${tabla}`,options)
    .then(res => res.json()).then(response => response) 
}

export function SubmitConsentimiento(datos,token) {
    console.log(datos.fecha)
    const data = {
        autoriza: true,
        userRegistro: datos.user,
        fechaExamen: datos.fecha,
        norden: datos.norden    
    }

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    return fetch(`${URLAzure}/api/v01/ct/consentDigit/registrar`,options)
    .then(res => res.json()).then(response => response)
}