import { URLAzure } from "../../../../../../config/config";

export function SubmitHematologia(data, token, user) {
   
    const body = {
        codLabclinico: data.codLabclinico ? data.codLabclinico : "0",
        fechaLab: data.fecha,
        chko: form.grupo === "O" ? true : false,
        chka: form.grupo === "A" ? true : false,
        chkb: form.grupo === "B" ? true : false,
        chkab: form.grupo === "AB" ? true : false,
        rbrhpositivo: form.rh === "+" ? true : false,
        rbrhnegativo: form.rh === "-" ? true : false,
        txtHemoglobina: form.hemoglobina,
        txtHematocrito: form.hematocrito,
        txtVsg: data.vsg,
        txtLeucocitosHematologia: data.leucocitos,
        txtHematiesHematologia: data.hematies,
        txtNeutrofilos: data.neutrofilos,
        txtAbastonados: data.abastonados,
        txtSegmentadosHematologia: data.segmentados,
        txtMonocitosHematologia: data.monocitos,
        txtEosinofilosHematologia: data.eosinofilos,
        txtBasofilosHematologia: data.basofilos,
        txtLinfocitosHematologia: data.linfocitos,
        txtGlucosaBio: data.glucosa,
        txtCreatininaBio: data.creatinina,
        chkPositivo: rprPos === true ? true : false,
        chkNegativo: rprPos === false ? true : false,
        txtVih: data.vih,
        txtColorEf: "data.",
        txtDensidadEf: "data",
        txtAspectoEf: "data",
        txtPhEf: "data",
        txtNitritosEq: "data.",
        txtProteinasEq: "data.",
        txtCetonasEq: "data.",
        txtLeucocitosEq: "data.",
        txtUrobilinogenoEq: "data.",
        txtBilirrubinaEq: "data.",
        txtGlucosaEq: "data.",
        txtSangreEq: "data.",
        txtLeucocitosSu: "data.",
        txtCelEpitelialesSu: "data.",
        txtCilindrosSu: "data.",
        txtBacteriasSu: "data.",
        txtHematiesSu: "data.",
        txtCristalesSu: "data.",
        txtPusSu: "data.",
        txtOtrosSu: "data.",
        txtCocaina: "data.",
        txtMarihuana: "data.",
        txtObservacionesLb: "data.",
        resLab: "data.",
        txtPlaquetas: "data.",
        txtAcAscorbico: "data.",
        userRegistro: "data.",
        userMedicoOcup: "data.",
        norden: 0
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