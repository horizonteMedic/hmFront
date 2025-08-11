import { useRef } from "react"
import { GetHistoriaC } from "../Admision/model/AdminHistoriaC.js"
import { GetHistoriaCTriaje, SubmitTriaje } from './model';
import Swal from "sweetalert2";
import ReporteTriaje from "../../../../jaspers/ReporteTriaje";
const Loading = (text) => {
    Swal.fire({
      title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
      html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>` ,
      icon: 'info',
      background: '#f0f6ff',
      color: '#22223b',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'swal2-border-radius',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-custom',
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
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
        GetHistoriaCTriaje(data, sede, token)
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

export const handleSubmit = async (datos,edad,nro,fecha,Swal,token,setF,setT,refreshtable,get,setH) => {
    const camposRequeridos = ['talla', 'peso', 'cintura', 'cadera', 'temperatura', 'fCardiaca', 'sat02',
        'perimetroCuello', 'sistolica', 'diastolica', 'fRespiratoria']; // agrega los campos que quieras
    const camposVacios = camposRequeridos.filter(campo => !datos[campo]);
    if (camposVacios.length > 0) {
        const lista = camposVacios.join(', ');
        return Swal.fire('Error', `Faltan completar: ${lista}`, 'error');
    } 
    if (datos.talla < 1.30 || datos.talla > 2.80){ 
      await Swal.fire('Error','No se permite este dato en Talla','error') 
      return}
    if (datos.peso < 40 || datos.peso > 150){ 
      await Swal.fire('Error','No se permite este dato en Peso','error') 
      return}
    if (datos.cintura < 45 || datos.cintura > 180){ 
      await Swal.fire('Error','No se permite este dato en Cintura','error') 
      return}
    if (datos.cadera < 70 || datos.cadera > 180){ 
      await Swal.fire('Error','No se permite este dato en Cadera','error') 
      return}

    if (datos.sat02 < 92 || datos.sat02 >= 101){ 
      await Swal.fire('Error','No se permite este dato en Cadera','error') 
      return}

    if (datos.temperatura < 35){ 
      await Swal.fire('Error','No se permite este dato en Termperatura','error') 
      return}
    if (datos.temperatura >= 40){ 
      await Swal.fire('Error','No se permite este dato en Termperatura','error') 
      return}


    if (datos.fCardiaca <= 39){ 
      await Swal.fire('Error','No se permite este dato en Frecuencia Cardiaca','error') 
      return}
    if (datos.sat02 < 92 || datos.sat02 > 100){ 
      await Swal.fire('Error','No se permite este dato en Sat02','error') 
      return}
    if (datos.perimetroCuello < 30 || datos.perimetroCuello > 55){ 
      await Swal.fire('Error','No se permite este dato en Perimetro Cuello','error') 
      return}

    if (datos.sistolica < 90){ 
      await Swal.fire('Error','No se permite este dato en Sistolica','error') 
      return}
    if (datos.sistolica >= 250){ 
      await Swal.fire('Error','No se permite este dato en Sistolica','error') 
      return}

    if (datos.diastolica < 60){ 
      await Swal.fire('Error','No se permite este dato en Diastolica','error') 
      return}
    if (datos.diastolica >= 150){ 
      await Swal.fire('Error','No se permite este dato en Diastolica','error') 
      return}

    if (datos.fRespiratoria == 0){ 
      await Swal.fire('Error','No se permite este dato en Frecuencia Respiratoria','error') 
      return}
    
    Swal.fire({
      title: 'Validando Datos',
      text: 'Espere por favor...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      didOpen: () => {
        Swal.showLoading();
      }
    });
    SubmitTriaje(datos,edad,nro,fecha,token)
    .then((res) => {
      console.log(res)
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
    .catch((error) => {
      if (error.name === 'AbortError') {
        Swal.fire('Error', 'El tiempo de espera termino.\nIntente otra vez','error')
      } else {
      Swal.fire('Error', 'Ocurrio un error al registrar/actualizar','error')

      }
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
      console.log(res)
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