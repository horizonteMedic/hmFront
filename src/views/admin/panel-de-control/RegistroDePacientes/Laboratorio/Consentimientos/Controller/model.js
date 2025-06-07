import { URLAzure } from "../../../../../../config/config";

export function GetInfoLaboratioEx(data, tabla, token, user) {
    
    const body = {
        nameConset: tabla,
        antConsumeMarih: data.antecedentes.MARIHUANA ?? false,
        antConsumeCocacina: data.antecedentes.COCAINA ?? false,
        antConsumeHojaCoca: data.antecedentes.COCA ?? false,
        antConsumeAnfetamina: data.antecedentes.ANFETAMINAS ?? false,
        antConsumeMethanfetamina: data.antecedentes.METAN ?? false,
        antConsumeBenzodiacepinas: data.antecedentes.BENZO ?? false,
        antConsumeOpiacesos: data.antecedentes.OPIA ?? false,
        antConsumeBarbituricos: data.antecedentes.BARBI ?? false,
        antConsumeMetadona: data.antecedentes.METADONA ?? false,
        antConsumeFenciclidina: data.antecedentes.FENCI ?? false,
        antConsumeAntidepreTricicli: data.antecedentes.ANTI ?? false,
        userRegistro: user,
        userMedicoOcup: "",
        fechaex: data.fecha,
        nOrden: data.norden
    };    
    
    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarConsentimientos`
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