import { URLAzure } from "../../../../../config/config";

export function SubmitCoprocultivo(data, user, token) {

    const body = {
        "norden": data.norden,
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

export function SubmitCoproParasitologia(data, user, token) {

    const body = {
        "norden": data.norden,
        "fecha": data.fecha,

        "txtcolor": data.heces1.color,
        "txtaspecto": data.heces1.aspecto,
        "txtmocoFecal": data.heces1.moco,
        "txtsangrev": data.heces1.sangre,
        "txtrestosa": data.heces1.restos,

        "txtleucocitos": data.micro1.leucocitos,
        "txthematies": data.micro1.hematies,
        "txtlugol": data.micro1.lugol,

        "txtcolor1": data.heces2.color,
        "txtaspecto1": data.heces2.aspecto,
        "txtmocoFecal1": data.heces2.moco,
        "txtsangrev1": data.heces2.sangre,
        "txtrestosa1": data.heces2.restos,

        "txtleucocitos1": data.micro2.leucocitos,
        "txthematies1": data.micro2.hematies,
        "txtlugol1": data.micro2.lugol,

        "txtcolor2": data.heces3.color,
        "txtaspecto2": data.heces3.aspecto,
        "txtmocoFecal2": data.heces3.moco,
        "txtsangrev2": data.heces3.sangre,
        "txtrestosa2": data.heces3.restos,

        "txtleucocitos2": data.micro3.leucocitos,
        "txthematies2": data.micro3.hematies,
        "txtlugol2": data.micro3.lugol,

        "txtgrasa": data.heces1.grasa,
        "txtgrasa1": data.heces2.grasa,
        "txtgrasa2": data.heces3.grasa,
        
        "userRegistro": user,
        "userMedicoOcup": "",
        "tipoCoproparasitologico": data.isCopro
    }

    const url = `${URLAzure}/api/v01/ct/manipuladores/registrarActualizarManipuladoresCoproparasitologico`
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
