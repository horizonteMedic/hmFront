import { URLAzure } from "../../../../../../config/config";

export function GetInfoLaboratioEx(data, tabla, token, user) {

    const body = {
        nameConset: tabla,
        antConsumeMarih: data.antecedentes.hasOwnProperty("CONSUME MARIHUANA (THC)") ? data.antecedentes["CONSUME MARIHUANA (THC)"]: false,
        antConsumeCocacina: data.antecedentes.hasOwnProperty("CONSUME COCAINA (COC)") ? data.antecedentes["CONSUME COCAINA (COC)"]: false,
        antConsumeHojaCoca: data.antecedentes.hasOwnProperty("CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS") ? data.antecedentes["CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS"]: false,
        antConsumeAnfetamina: data.antecedentes.hasOwnProperty("CONSUME ANFETAMINAS (AMP)")  ? data.antecedentes["CONSUME ANFETAMINAS (AMP)"]  : false,
        antConsumeMethanfetamina: data.antecedentes.hasOwnProperty("CONSUME METHANFETAMINAS (MET)") ? data.antecedentes["CONSUME METHANFETAMINAS (MET)"]: false,
        antConsumeBenzodiacepinas: data.antecedentes.hasOwnProperty("CONSUME BENZODIAZEPINAS (BZO)") ? data.antecedentes["CONSUME BENZODIAZEPINAS (BZO)"]: false,
        antConsumeOpiacesos: data.antecedentes.hasOwnProperty("CONSUME OPIÁCEOS (OPI)") ? data.antecedentes["CONSUME OPIÁCEOS (OPI)"]: false,
        antConsumeBarbituricos: data.antecedentes.hasOwnProperty("CONSUME BARBITÚRICOS (BAR)") ? data.antecedentes["CONSUME BARBITÚRICOS (BAR)"]: false,
        antConsumeMetadona: data.antecedentes.hasOwnProperty("CONSUME METADONA (MTD)") ? data.antecedentes["CONSUME METADONA (MTD)"]: false,
        antConsumeFenciclidina: data.antecedentes.hasOwnProperty("CONSUME FENCICLIDINA (PCP)") ? data.antecedentes["CONSUME FENCICLIDINA (PCP)"]: false,
        antConsumeAntidepreTricicli: data.antecedentes.hasOwnProperty("CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)") ? data.antecedentes["CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)"]: false,
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