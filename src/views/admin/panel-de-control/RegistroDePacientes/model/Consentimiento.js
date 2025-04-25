import { URLAzure } from "../../../../config/config"

export function GetNoConsentimiento(norden,token) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    
    return fetch(URLAzure+`/api/v01/ct/infoPersonalPaciente/busquedaPorNorden/${norden}`,options)
    .then(res => res.json()).then(response => response) 
}

export function SubmitConsentimiento(datos,token) {

    const data = {
        autoriza: true,
        userRegistro: datos.user,
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