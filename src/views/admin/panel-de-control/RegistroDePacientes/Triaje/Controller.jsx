import { useRef } from "react"
import { GetHistoriaC } from "../model/AdminHistoriaC"
import { SubmitTriaje } from './model';

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
        norden: nro,
        nombres_apellidos_p: nombre
    }
    GetHistoriaC(data, sede, token)
    .then((res) => {
        set(res)
    })
}

export const SearchHC = (event,nro,set,sede,token) => {
    if (event.key === 'Enter') {
        const data = {
        opcion_id_p: 2,
        norden: Number(nro.codigo),
        nombres_apellidos_p: ""
        }
        GetHistoriaC(data, sede, token)
        .then((res) => {
            set(res)
        })
    }
}


export const handleNombreChange = (e,set,setTable,sede,token,debounceTimeout) => {
    const value = e.target.value.toUpperCase();
    set(prev => ({ ...prev, nombres: value, codigo: "" }));
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (value.trim() !== "") {
        const data = {
          opcion_id_p: 3,
          norden: "",
          nombres_apellidos_p: value
        };
        GetHistoriaC(data, sede, token)
          .then((res) => {
            if (res && res.length) {
                console.log(res)
              setTable(res);
            } else {
              setTable([]);
            }
          })
          .catch(() => setTable([]));
      } else {
        setTable([]);
      }
    }, 400);

  };

export const handleSubmit = (datos,edad,nro,fecha,Swal,token) => {
    const camposRequeridos = ['talla', 'peso', 'cintura', 'cadera', 'temperatura', 'fCardiaca', 'sat02',
        'perimetroCuello', 'sistolica', 'diastolica', 'fRespiratoria']; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter(campo => !datos[campo]);
    if (camposVacios.length > 0) {
        const lista = camposVacios.join(', ');
        return Swal.fire('Error', `Faltan completar: ${lista}`, 'error');
    } 
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SubmitTriaje(datos,edad,nro,fecha,token)
    .then((res) => {
        console.log(res)
    })
}