import { URLAzure } from "../../../../../../config/config";

export function SubmitGonadotropina(data,user,token) {
    const body = {
        fechaExamen: data.fecha,
        txtResultado: data.resultado,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };    

    const url = `${URLAzure}/api/v01/ct/inmunologia/registrarActualizarLgonadotropina`
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

export function SubmitMicrobiologia(data,user,token) {
    const body = {
        fecha: data.fecha,
        txtMuestra1: data.bk1,
        txtMuestra2: data.bk2,
        txtKoh: data.koh,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };    

    const url = `${URLAzure}/api/v01/ct/inmunologia/registrarActualizarMicrobiologia`
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