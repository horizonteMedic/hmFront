import { URLAzure } from "../../../../config/config"

export function SubmitTriaje(data,edad,nOrden,fecha,token) {
        console.log(nOrden)

    const body = {
        codTriaje: 0,
        numTicket: 0,
        edad: edad,
        fechaTriaje: fecha,
        talla: data.talla,
        peso: data.peso,
        imc: data.imc,
        cintura: data.cintura,
        icc: data.icc,
        cadera: data.cadera,
        temperatura: data.temperatura,
        sat02: data.sat02,
        perimetroCuello: data.perimetroCuello,
        sistolica: data.sistolica,
        diastolica: data.diastolica,
        fvc: null,
        fev1: null,
        fev1Fvc: null,
        fef2575: null,
        conclusion: data.diagnostico,
        nOrden: nOrden,
        fCardiaca: data.fCardiaca,
        fRespiratoria: data.fRespiratoria
    }
    console.log(JSON.stringify(body))

    const url = `${URLAzure}/api/v01/ct/triaje/registrarActualizar`
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