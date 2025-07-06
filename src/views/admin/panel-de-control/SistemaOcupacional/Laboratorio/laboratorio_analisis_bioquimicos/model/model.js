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
        codAb: data.codAb ? data.codAb : null,
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

export function SubmitPerfilRenal(data,user,token) {

    const body = {
        norden: data.norden,
        fechaExamen: data.fecha,
        txtCreatinina: data.creatinina,
        txtUreaSerica: data.urea,
        txtAcidoUrico: data.acidoUrico,
        userRegistro: user,
        userMedicoOcup: ""
    };    
    const url = `${URLAzure}/api/v01/ct/analisisBioquimico/registrarActualizarPerfilRenal`
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

export function SubmitAcidoUrico(data,user,token) {

    const body = {
        norden: data.norden,
        fecha: data.fecha,
        txtPrueba: data.prueba,
        txtMuestra: data.muestra,
        txtResultado: data.resultado,
        userRegistro: user,
        userMedicoOcup: ""
    };    
    const url = `${URLAzure}/api/v01/ct/analisisBioquimico/registrarActualizarAcidoUrico`
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

export function SubmitPerfilHepatico(data,user,token) {

    const body = {
        norden: data.norden,
        fechaExamen: data.fecha,
        txtrTgo: data.tgo,
        txtrTgp: data.tgp,
        txtrGgt: data.ggt,
        txtrFosfalcalina: data.fosfAlc,
        txtrBilirrTotal: data.biliTotal,
        txtrBilirrDirecta: data.biliDir,
        txtrBilirrIndirecta: data.biliInd,
        txtrProteTotales: data.protTot,
        txtrAlbumina: data.albumina,
        txtrGlobulina: data.globSer,
        userRegistro: user,
        userMedicoOcup: ""
    };    
    const url = `${URLAzure}/api/v01/ct/analisisBioquimico/registrarActualizarPerfilHepatico`
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