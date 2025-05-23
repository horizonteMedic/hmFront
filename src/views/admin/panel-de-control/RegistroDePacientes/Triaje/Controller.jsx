import { GetHistoriaC } from "../model/AdminHistoriaC"

export const VerifyTR = (nro,get,token) => {
    console.log(nro,get,token)
    get(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${'triaje'}`,token)
    .then((res) => {
        console.log(res)
    })
}

export const GetInfoPac = (form,set,get,token,sede) => {
    get(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${form.nro}&nomSede=${sede}`,token)
    .then((res) => {
        set(res)
    })
}

export const Clean = (setF,setT) => {
    setF({
        ocupacional: true,
        asistencial: false,
        nro: '',
        nomExam: '',
        empresa: '',
        contrata: '',
        nroHistorial: '',
        nombres: '',
        apellidos: '',
        edad: '',
        fechaNac: '',
        fechaExamen: '',
        recibo: false,
        nOrden: true,
    })
    setT({
        talla: '', peso: '', imc: '', cintura: '', icc: '',
        cadera: '', temperatura: '', fCardiaca: '', sat02: '', perimetroCuello: '',
        sistolica: '', diastolica: '', fRespiratoria: '',
        diagnostico: '',
    })
}

export const GetTable = (nro,nombre,sede,token,set) => {
    const data = {
        opcion_id_p: 1,
        norden_: nro,
        nombres_apellidos_p: nombre
    }
    GetHistoriaC(data, sede, token)
    .then((res) => {
        set(res)
    })
    
}