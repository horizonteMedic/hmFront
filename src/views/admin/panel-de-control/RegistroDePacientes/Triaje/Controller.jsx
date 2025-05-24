import { useRef } from "react"
import { GetHistoriaC } from "../model/AdminHistoriaC"
import { SubmitTriaje } from './model';
import Swal from "sweetalert2";

const Loading = () => {
  Swal.fire({
        title: 'Validando Datos',
        text: 'Espere por favor...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
}

export const VerifyTR = async (form,get,token,set,setTR,sede) => {
    if (!form.nro) { 
      await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
      return
    }
    Loading()
    get(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${form.nro}&nomService=${'triaje'}`,token)
    .then((res) => {
        if (res.id === 0) {
          console.log('asdasd')
          GetInfoPac(form,set,get,token,sede)
        } else {
          console.log('registrado')
          GetListTriajeMult(form.nro,set,setTR,get,token)
        }
    })
}

export const GetInfoPac = (form,set,get,token,sede) => {
    get(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${form.nro}&nomSede=${sede}`,token)
    .then((res) => {
        set({...res,nro: res.norden})
    })
    .finally(() => {
      Swal.close()
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
    console.log(nro)
    SubmitTriaje(datos,edad,nro,fecha,token)
    .then((res) => {
      console.log(res)
        if (res.id === 1) {
          Swal.fire('Exito',`${res.mensaje}`,'success')
        } else if (res.id === 0){
          Swal.fire('Exito',`${res.mensaje}`,'success')
        }
    })
}

//FUNCION MULTIPLE DE LOBO
export const GetListTriajeMult = async (nro,set,setTR,get,token) => {
  if (!nro){
    await  Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
    return
  }  
  get(`/api/v01/ct/triaje/listarFormatoTriaje/${nro}`,token)
  .then((res) => {
    if (res.n_orden) {
      set({
        nro: res.n_orden,
        nomExam: res.nom_examen,
        empresa: res.razon_empresa,
        contrata: res.razon_contrata,
        fechaNac: res.fecha_nac,
        nombres: res.nombres,
        apellidos: res.apellidos,
        fechaExamen: res.fecha_triaje
      })
      setTR({
        talla: res.talla, peso: res.peso, imc: res.imc, cintura: res.cintura, icc: res.icc,
        cadera: res.cadera, temperatura: res.temperatura, fCardiaca: res.f_cardiaca, sat02: res.sat_02, perimetroCuello: res.perimetro_cuello,
        sistolica: res.sistolica, diastolica: res.diastolica, fRespiratoria: res.f_respiratoria,
        diagnostico: res.conclusion,
      })
    } else {
      Swal.fire('Error','No se Encontro un Registro de Triaje para esta Historia Clinica','error')
    }
  })
  .catch(() => {
      Swal.fire('Error','No se Encontro un Registro de Triaje para esta Historia Clinica','error')
  })
  .finally(() => {
    Swal.close()
  })
}

export const GetListTriajeMulttable = async (nro,set,setTR,get,token) => {
  if (!nro){
    await  Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
    return
  }  
  get(`/api/v01/ct/triaje/listarFormatoTriaje/${nro}`,token)
  .then((res) => {
    if (res.n_orden) {
      set({
        nro: res.n_orden,
        nomExam: res.nom_examen,
        empresa: res.razon_empresa,
        contrata: res.razon_contrata,
        fechaNac: res.fecha_nac,
        nombres: res.nombres,
        apellidos: res.apellidos,
        fechaExamen: res.fecha_triaje
      })
      setTR({
        talla: res.talla, peso: res.peso, imc: res.imc, cintura: res.cintura, icc: res.icc,
        cadera: res.cadera, temperatura: res.temperatura, fCardiaca: res.f_cardiaca, sat02: res.sat_02, perimetroCuello: res.perimetro_cuello,
        sistolica: res.sistolica, diastolica: res.diastolica, fRespiratoria: res.f_respiratoria,
        diagnostico: res.conclusion,
      })
    } else {
      Swal.fire('Error','No se Encontro un Registro de Triaje para esta Historia Clinica','error')
    }
  })
  .catch(() => {
      Swal.fire('Error','No se Encontro un Registro de Triaje para esta Historia Clinica','error')
  })
}