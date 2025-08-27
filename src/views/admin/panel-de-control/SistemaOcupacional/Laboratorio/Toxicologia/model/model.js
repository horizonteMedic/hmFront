import { URLAzure } from "../../../../../../config/config";

export function SubmitToxPanel2D(data,user,token) {
    const body = {
        reMarihuana: data.valueM,
        reCocaina: data.valueC,
        userRegistro: user,
        txtMetodo: data.metodo,
        userMedicoOcup: "",
        fechaExamen: data.fecha,
        norden: data.norden
    };

    const url = `${URLAzure}/api/v01/ct/toxicologia/registrarActualizarPanel2D`
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

export function SubmitToxPanel3D(data,user,token) {
    const body = {
        fechaExamen: data.fecha,
        txtMetodo: data.metodo,
        txtCocaina: data.valueC,
        txtMarihuana: data.valueM,
        txtExtasis: data.valueE,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };

    const url = `${URLAzure}/api/v01/ct/toxicologia/registrarActualizarPanel3D`
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

export function SubmitToxPanel5D(data,user,token) {
    const body = {
        fechaExamen: data.fecha,
        txtrCocaina: data.valueC,
        txtrMarihuana: data.valueM,
        txtrAnfetamina: data.valueAn,
        txtrMethanfetamina: data.valueMet,
        txtrBenzodiacepina: data.valueBen,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };

    const url = `${URLAzure}/api/v01/ct/toxicologia/registrarActualizarPanel5D`
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

export function SubmitToxPanel10D(data,user,token) {
    const body = {
        fechaExamen: data.fecha,
        txtMetodo: data.metodo,
        txtCocaina: data.valueC,
        txtMarihuana: data.valueM,
        txtAnfetamina: data.valueAn,
        txtMetanfetamina: data.valueMet,
        txtBenzodiacepina: data.valueBen,
        txtOpiaceos: data.valueOpi,
        txtBarbituricos: data.valueBar,
        txtMetadona: data.valueMetadona,
        txtFenciclidina: data.valueFenci,
        txtAntidepresivos: data.valueAnti,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };

    const url = `${URLAzure}/api/v01/ct/toxicologia/registrarActualizarPanel10D`
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

export function SubmitToxPanel4D(data,user,token) {
    const body = {
        fechaExamen: data.fecha,
        txtrCocaina: data.valueC,
        txtrMarihuana: data.valueM,
        txtrOpiaceos: data.valueO,
        txtrMethanfetamina: data.valueMet,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };

    const url = `${URLAzure}/api/v01/ct/toxicologia/registrarActualizarPanel4D`
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