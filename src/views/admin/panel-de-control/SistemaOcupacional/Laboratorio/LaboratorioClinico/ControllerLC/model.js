import { URLAzure } from "../../../../../../config/config";

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