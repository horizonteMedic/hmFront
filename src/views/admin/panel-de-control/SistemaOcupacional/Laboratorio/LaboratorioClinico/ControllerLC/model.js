import { URLAzure } from "../../../../../../config/config";

export function SubmitHematologia(data, dataO, token, user) {
   
    const body = {
        codLabclinico: data.codLabclinico ? data.codLabclinico : "0",
        fechaLab: data.fecha,
        resLab: data.responsable,
        chko: data.grupo === "O" ? true : false,
        chka: data.grupo === "A" ? true : false,
        chkb: data.grupo === "B" ? true : false,
        chkab: data.grupo === "AB" ? true : false,
        rbrhpositivo: data.rh === "Rh(+)" ? true : false,
        rbrhnegativo: data.rh === "Rh(-)" ? true : false,
        txtHemoglobina: data.hemoglobina,
        txtHematocrito: data.hematocrito,
        txtVsg: data.vsg,
        txtPlaquetas: data.plaquetas,
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
        chkPositivo: data.rprPos === true ? true : false,
        chkNegativo: data.rprPos === false ? true : false,
        txtVih: data.vih,
        //ORINA
        txtColorEf: dataO.Color,
        txtDensidadEf: dataO.Densidad,
        txtAspectoEf: dataO.Aspecto,
        txtPhEf: dataO.PH,
        //EXAMEN QUIMICO
        txtNitritosEq: dataO.Nitritos,
        txtProteinasEq: dataO.Proteínas,
        txtCetonasEq: dataO.Cetonas,
        txtLeucocitosEq: dataO.LeucocitosQ,
        txtAcAscorbico: dataO.AcAscorbico,
        txtUrobilinogenoEq: dataO.Urobilinogeno,
        txtBilirrubinaEq: dataO.Bilirrubina,
        txtGlucosaEq: dataO.GlucosaQ,
        txtSangreEq: dataO.Sangre,
        //SEDIMIETNO
        txtLeucocitosSu: dataO.LeucocitosS,
        txtCelEpitelialesSu: dataO.CelEpiteliales,
        txtCilindrosSu: dataO.Cilindros,
        txtBacteriasSu: dataO.Bacterias,
        txtHematiesSu: dataO.Hematies,
        txtCristalesSu: dataO.Cristales,
        txtPusSu: dataO.GramSC,
        txtOtrosSu: dataO.Otros,
        //DROGAS
        txtCocaina: dataO.Cocaina,
        txtMarihuana: dataO.Marihuana,
        txtObservacionesLb: dataO.observaciones,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };    

    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp`
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

export function SubmitHematograma(data,token,user) {
    const body = {
        fechaExamen: data.fecha,
        txtHemoglobina: data.hemoglobina,
        txtHematocrito: data.hematocrito,
        txtHematies: data.hematies,
        txtVolumen: data.volumen_corpuscular_medio,
        txtHemocorpuscular: data.hemoglobina_corpuscular_media,
        txtConcentracion: data.concentracion_hemoglobina_corpuscular,
        txtLeucocitos: data.leucocitos,
        txtNeutrofilos: data.neutrofilos,
        txtAbastonados: data.abastonados,
        txtSegmentados: data.segmentados,
        txtMonocitos: data.monocitos,
        txtEosinofios: data.eosinofilos,
        txtBasofilos: data.basofilos,
        txtLinfocitos: data.linfocitos,
        txtPlaquetas: data.plaquetas,
        userRegistro: user,
        userMedicoOcup: "",
        norden: data.norden
    };    

    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarLabHematograma`
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