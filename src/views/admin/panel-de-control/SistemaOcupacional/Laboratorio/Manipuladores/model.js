import { URLAzure } from "../../../../../config/config";

export function SubmitCoprocultivo(data,user, token) {

    const body = {
        "norden":data.norden,
        "fecha": data.fecha,
        "txtmuestra": data.muestra,
        "txtcolor": data.color,
        "txtconsistencia": data.consistencia,
        "txtmoco_fecal": data.moco_fecal,
        "txtsangrev": data.sangrev,
        "txtrestosa": data.restosa,
        "txtleucocitos": data.leucocitos,
        "txthematies": data.hematies,
        "txtparasitos": data.parasitos,
        "txtgotasg": data.gotasg,
        "txtlevaduras": data.levaduras,
        "txtidentificacion": data.identificacion,
        "txtflorac": data.florac,
        "txtresultado": data.resultado,
        "txtobservaciones": data.observaciones,
        "user_registro": user,
        "user_medico_ocup": ""
    }

    const url = `${URLAzure}/api/v01/ct/manipuladores/registrarActualizarManipuladores`
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
