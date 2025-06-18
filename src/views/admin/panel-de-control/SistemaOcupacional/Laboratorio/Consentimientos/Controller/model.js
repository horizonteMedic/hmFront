import { URLAzure } from '../../../../../../config/config';

export function GetInfoLaboratioEx(data, tabla, token, user) {

    const camposAPI = {
        MARIHUANA: { valor: 'antConsumeMarih', fecha: 'fechaConsumeMarih' },
        COCAINA: { valor: 'antConsumeCocacina', fecha: 'fechaConsumeCocacina' },
        COCA: { valor: 'antConsumeHojaCoca', fecha: 'fechaConsumoHojaCoca' },
        ANFETAMINAS: { valor: 'antConsumeAnfetamina', fecha: 'fechaConsumeAnfetamina' },
        METAN: { valor: 'antConsumeMethanfetaminaOOpiaceos', fecha: 'fechaConsumeMethanfetamina' },
        BENZO: { valor: 'antConsumeBenzodiacepinas', fecha: 'fechaConsumeBenzodiacepinas' },
        OPIA: { valor: 'antConsumeOpiacesos', fecha: 'fechaConsumeOpiacesos' },
        BARBI: { valor: 'antConsumeBarbituricos', fecha: 'fechaConsumeBarbituricos' },
        METADONA: { valor: 'antConsumeMetadona', fecha: 'fechaConsumeMetadona' },
        FENCI: { valor: 'antConsumeFenciclidina', fecha: 'fechaConsumeFenciclidina' },
        ANTI: { valor: 'antConsumeAntidepreTricicli', fecha: 'fechaConsumeAntidepreTricicli' }
        };

    const body = {
        nameConset: tabla,
        userRegistro: user,
        userMedicoOcup: "",
        fechaex: data.fecha,
        nOrden: data.norden
    };
    console.log(data.antecedentes)
    data.antecedentes.forEach(({ key, value, fecha }) => {
        const campos = camposAPI[key];
        if (campos) {
        body[campos.valor] = value ?? false;
        body[campos.fecha] = fecha ?? null;
        }
    });

   
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

export function GetInfoLaboratioEx2(data, tabla, token, user) {

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