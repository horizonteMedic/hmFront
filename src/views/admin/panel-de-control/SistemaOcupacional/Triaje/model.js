import { URLAzure } from "../../../../config/config"

export function SubmitTriaje(data,edad,nOrden,fecha,token) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const body = {
        codTriaje: 0,
        numTicket: 0,
        edad: edad,
        fechaTriaje: fecha,
        talla: data.talla,
        peso: data.peso,
        imc: data.imc,
        cintura: data.cintura,
        icc: data.icc,
        cadera: data.cadera,
        temperatura: data.temperatura,
        sat02: data.sat02,
        perimetroCuello: data.perimetroCuello,
        sistolica: data.sistolica,
        diastolica: data.diastolica,
        fvc: null,
        fev1: null,
        fev1Fvc: null,
        fef2575: null,
        conclusion: data.diagnostico,
        nOrden: nOrden,
        fCardiaca: data.fCardiaca,
        fRespiratoria: data.fRespiratoria
    }

    const url = `${URLAzure}/api/v01/ct/triaje/registrarActualizar`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
            signal: controller.signal
        }
        return fetch(url,options)
        .then(res =>  {
            clearTimeout(timeout)
            if (!res.ok) {
                return res
            } return res.json()})
        .then(response => response) 
        
}

export function GetHistoriaCTriaje(data,sede,token) {

    const body = {
      opcion_id_p: data.opcion_id_p,
      norden_p: data.norden,
      nombres_apellidos_p: data.nombres_apellidos_p,
      cod_sede_p: sede
    };    
    const url = `${URLAzure}/api/v01/ct/registroPacientes/listadoHistoriasOcupacionalesTriajeConFiltros`
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