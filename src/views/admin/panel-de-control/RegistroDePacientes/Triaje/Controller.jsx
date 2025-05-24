import { useRef } from "react"
import { GetHistoriaC } from "../model/AdminHistoriaC"
import { GetHistoriaCTriaje, SubmitTriaje } from './model';
import Swal from "sweetalert2";
import ReporteTriaje from "../../../../jaspers/ReporteTriaje";
const Loading = (text) => {
  Swal.fire({
        title: text,
        text: 'Espere por favor...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
}

export const VerifyTR = async (form,get,token,set,setTR,sede,setHTR,setH) => {
    if (!form.nro) { 
      await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
      return
    }
    setH(true)
    Loading('Validando datos')
    get(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${form.nro}&nomService=${'triaje'}`,token)
    .then((res) => {
        if (res.id === 0) {
          console.log('asdasd')
          GetInfoPac(form,set,get,token,sede)
        } else {
          console.log('registrado')
          GetListTriajeMult(form.nro,set,setTR,get,token,false,setHTR)
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
    GetHistoriaCTriaje(data, sede, token)
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
        GetHistoriaCTriaje(data, sede, token)
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

export const handleSubmit = (datos,edad,nro,fecha,Swal,token,setF,setT,refreshtable,get,setH) => {
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
        if (res.id === 1) {
          refreshtable()
          Clean(setF,setT)
          setH(true)
          Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              GetListTriajeMult(nro,setF,setT,get,token,true)
            }
          })
          
        } else if (res.id === 0){
          refreshtable()
          Clean(setF,setT)
          setH(true)
          Swal.fire({title: 'Exito', text:`${res.mensaje},\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              GetListTriajeMult(nro,setF,setT,get,token,true)
            }
          })
        }
    })
    .catch(() => {
      Swal.fire('Error', 'Ocurrio un error al registrar/actualizar','error')
    })
}

//FUNCION MULTIPLE DE LOBO
export const GetListTriajeMult = async (nro,set,setTR,get,token,jasper,setHTR) => {
  if (!nro){
    await  Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
    return
  }  
  if (jasper) {
    Loading('Cargando Formato a Imprimir')
  }
  get(`/api/v01/ct/triaje/listarFormatoTriaje/${nro}`,token)
  .then(async(res) => {
    if (res.n_orden) {
      if (jasper) {
        await GetJasper(res,token)
        return
      }
      setHTR(true)
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

export const GetListTriajeMulttable = async (nro,set,setTR,get,token,setHTR,setH) => {
  if (!nro){
    await  Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
    return
  }  
  get(`/api/v01/ct/triaje/listarFormatoTriaje/${nro}`,token)
  .then((res) => {
    if (res.n_orden) {
      setH(true)
      setHTR(true)
      console.log(res)
      set({
        nro: res.n_orden,
        nomExam: res.nom_examen,
        empresa: res.razon_empresa,
        contrata: res.razon_contrata,
        fechaNac: res.fecha_nac,
        nombres: res.nombres,
        apellidos: res.apellidos,
        edad: res.edad,
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

export const GetJasper = async (nro,token) => {
  ReporteTriaje(nro)
}