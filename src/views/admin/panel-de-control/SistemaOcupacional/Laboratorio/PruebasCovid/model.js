import { URLAzure } from "../../../../../config/config";

export function SubmitCuantAntigenos(data, user, token) {

    const body = {
        "norden": data.norden,
        "fechaExamen": data.fecha,

        "dniPa": 0,

        "cuantitativoAntigeno": true,
        "cboMarca": data.marca,
        "valorIgm": data.valor,

        "chkIgmReactivo": false,
        "chkIgmNoReactivo": false,
        "chkIggReactivo": false,
        "chkIggNoReactivo": false,
        "chkInvalido": false,
        "txtObservaciones": "",
        "txtVrIgm": "",
        "txtVrIgg": "",
        "valorIgg": 0,
        "medico": "",
        "fechaSintomas": data.fecha,
        "formatoMarsa": false,


        "user_registro": user
    }


    const url = `${URLAzure}/api/v01/ct/pruebasCovid/registrarActualizarExamenInmunologico`
    console.log("tokensasasass", token);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
    return fetch(url, options).then(res => {
        if (!res.ok) {
            return res
        } return res.json()
    }).then(response => response)
}
