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
    console.log(data)
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

export function SubmitInmunologia(data,user,token) {
    const body = {
        norden: data.norden,
        fecha: data.fecha,
        txtTificoO: data.tificoO,
        txtTificoH: data.tificoH,
        txtParatificoA: data.paratificoA,
        txtParatificoB: data.paratificoB,
        txtBrucella: data.brucella,
        txtHepatitis: data.hepatitisA,
        userRegistro: user,
        userMedicoOcup: "",
    };    

    const url = `${URLAzure}/api/v01/ct/inmunologia/registrarActualizarInmunologia`
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

export function SubmitHepatitis(data,user,token) {
    console.log(data)
    const body = {
        fechaExamen: data.fecha,
        txtMarca: data.marca,
        txtHepatitisa: data.resultadoHAV,
        txtHepatitisb: data.resultadoHBsAg,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden,
    };    

    const url = `${URLAzure}/api/v01/ct/inmunologia/registrarActualizarHepatitis`
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