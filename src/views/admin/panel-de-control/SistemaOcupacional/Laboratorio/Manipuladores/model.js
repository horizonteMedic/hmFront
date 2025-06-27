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
        "txtgrasa": data.heces1.grasa,

        "txtleucocitos": data.micro1.leucocitos,
        "txthematies": data.micro1.hematies,
        "txtlugol": data.micro1.parasitos,
        //==
        "txtcolor1": data.isCopro ? "" : data.heces2.color,
        "txtaspecto1": data.isCopro ? "" : data.heces2.aspecto,
        "txtmocoFecal1": data.isCopro ? "" : data.heces2.moco,
        "txtsangrev1": data.isCopro ? "" : data.heces2.sangre,
        "txtrestosa1": data.isCopro ? "" : data.heces2.restos,
        "txtgrasa1": data.isCopro ? "" : data.heces2.grasa,

        "txtleucocitos1": data.isCopro ? "" : data.micro2.leucocitos,
        "txthematies1": data.isCopro ? "" : data.micro2.hematies,
        "txtlugol1": data.isCopro ? "" : data.micro2.parasitos,

        "txtcolor2": data.isCopro ? "" : data.heces3.color,
        "txtaspecto2": data.isCopro ? "" : data.heces3.aspecto,
        "txtmocoFecal2": data.isCopro ? "" : data.heces3.moco,
        "txtsangrev2": data.isCopro ? "" : data.heces3.sangre,
        "txtrestosa2": data.isCopro ? "" : data.heces3.restos,
        "txtgrasa2": data.isCopro ? "" : data.heces3.grasa,

        "txtleucocitos2": data.isCopro ? "" : data.micro3.leucocitos,
        "txthematies2": data.isCopro ? "" : data.micro3.hematies,
        "txtlugol2": data.isCopro ? "" : data.micro3.parasitos,

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
