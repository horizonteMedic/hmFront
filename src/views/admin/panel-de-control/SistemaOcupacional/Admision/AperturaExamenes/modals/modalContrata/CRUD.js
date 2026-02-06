import { URLAzure } from "../../../../../../../config/config";

export function SubmitNewContrata(data, token) {

    const body = {
        rucContrata: data.rucContrata?.trim(),
        razonContrata: data.razonContrata?.trim(),
        direccionContrata: data.direccionContrata?.trim(),
        telefonoContrata: data.telefonoContrata?.trim(),
        responsableContrata: data.responsableContrata?.trim(),
        emailContrata: data.emailContrata?.trim(),
        apiToken: data.apiToken,
    };

    const url = `${URLAzure}/api/v01/ct/Contr`
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