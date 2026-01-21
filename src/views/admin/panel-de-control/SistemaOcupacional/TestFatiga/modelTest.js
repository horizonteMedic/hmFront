import { URLAzure } from "../../../../config/config";

export function SubmitTestFatigaJs(data, user, token) {
    const body = {
        "codEval": data.codEval ? data.codEval : null,
        "nOrden": data.norden,
        "codPa": data.dni,
        "edad": data.edad,
        "fExamen": data.fexamen,
        "rbs1Nunca": data.rbs1Nunca,
        "rbs1Poca": data.rbs1Poca,
        "rbs1Moderada": data.rbs1Moderada,
        "rbs1Alta": data.rbs1Alta,
        "rbs2Nunca": data.rbs2Nunca,
        "rbs2Poca": data.rbs2Poca,
        "rbs2Moderada": data.rbs2Moderada,
        "rbs2Alta": data.rbs2Alta,
        "rbs3Nunca": data.rbs3Nunca,
        "rbs3Poca": data.rbs3Poca,
        "rbs3Moderada": data.rbs3Moderada,
        "rbs3Alta": data.rbs3Alta,
        "rbs4Nunca": data.rbs4Nunca,
        "rbs4Poca": data.rbs4Poca,
        "rbs4Moderada": data.rbs4Moderada,
        "rbs4Alta": data.rbs4Alta,
        "rbs5Nunca": data.rbs5Nunca,
        "rbs5Poca": data.rbs5Poca,
        "rbs5Moderada": data.rbs5Moderada,
        "rbs5Alta": data.rbs5Alta,
        "rbs6Nunca": data.rbs6Nunca,
        "rbs6Poca": data.rbs6Poca,
        "rbs6Moderada": data.rbs6Moderada,
        "rbs6Alta": data.rbs6Alta,
        "rbs7Nunca": data.rbs7Nunca,
        "rbs7Poca": data.rbs7Poca,
        "rbs7Moderada": data.rbs7Moderada,
        "rbs7Alta": data.rbs7Alta,
        "rbs8Nunca": data.rbs8Nunca,
        "rbs8Poca": data.rbs8Poca,
        "rbs8Moderada": data.rbs8Moderada,
        "rbs8Alta": data.rbs8Alta,
        "rbs9Nunca": data.rbs9Nunca,
        "rbs9Poca": data.rbs9Poca,
        "rbs9Moderada": data.rbs9Moderada,
        "rbs9Alta": data.rbs9Alta,
        "rbSi": data.rbSi,
        "rbNo": data.rbNo,
        "txtPuntaje": data.txtPuntaje,
        "txtMedico": data.txtMedico,
        "dniUser": data.dniUser,
        "userRegistro": user,
        "usuarioFirma": data.user_medicoFirma,
    };

    const url = `${URLAzure}/api/v01/ct/testFatigaSomnolencia/registrarActualizarTestFatigaSomnolencia`
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
