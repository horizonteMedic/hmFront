import { URLAzure } from '../../../../../../config/config';

export function GetInfoLaboratioEx(data, tabla, token, user, fechaCoca) {
   
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
        fechaConsumoHojaCoca: fechaCoca,
        nOrden: data.norden
    };    
    console.log(JSON.stringify(body))
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

export function SubmitInfoLaboratioExBoro(data, token, user) {
   
    const body = {
        antBoroAlgunaEnfermedad: data.enfermedad.key,
        antBoroAlgunMedicamento: data.medicamento.key,
        antBoroConsumenMateCoca: data.matecoca.key,
        antBoroTratQuirugODental: data.tratamiento.key,
        critCualAlgunaEnfermedad: data.enfermedad.cual,
        critCualAlgunMedicamento: data.medicamento.cual,
        critFechaConsumoMateCoca: data.matecoca.fecha,
        fechaConsumoHojaCoca: data.chaccha.fecha,
        critCualTratQuirugODental: data.tratamiento.cual,
        critCuandoTratQuirugODental: data.tratamiento.cuando,
        critDondeTratQuirugODental: data.tratamiento.donde,
        userRegistro: user,
        trabajador: data.trabajador,
        postulante: data.postulante,
        userMedicoOcup: "AGARCIA",
        fechaex: data.fecha,
        masticahCoca: data.chaccha.key,
        notas: data.notas,
        norden: data.norden
    };    

    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarConsentimientoBORO`
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