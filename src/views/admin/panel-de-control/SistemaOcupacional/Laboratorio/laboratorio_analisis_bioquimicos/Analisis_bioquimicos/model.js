import { URLAzure } from "../../../../../../config/config";

export function GetTableAnalBio(data,sede,token) {

    const body = {
      opcion_id_p: data.opcion_id_p,
      norden_p: data.norden,
      nombres_apellidos_p: data.nombres_apellidos_p,
      cod_sede_p: sede
    };    
    const url = `${URLAzure}/api/v01/ct/laboratorio/listadoHistoriasOcupacionalesAnalisisBioquimicos`
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

export function SubmitLabAnalBio(data,user,token) {
    const body = {
        codAb: data.codAb ? data.codAb : "0",
        fechaAb: data.fecha,
        txtReponsable: data.medico,
        txtCreatinina: data.creatinina,
        txtColesterol: data.colesterolTotal,
        txtLdlColesterol: data.ldl,
        txtHdlColesterol: data.hdl,
        txtVldlColesterol: data.vldl,
        txtTrigliseridos: data.trigliceridos,
        userRegistro: user,
        userMedicoOcup: "",
        nOrden: data.norden,
    };    
    console.log(JSON.stringify(body))
    const url = `${URLAzure}/api/v01/ct/laboratorio/registrarActualizarAnalisisBioquimico`
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