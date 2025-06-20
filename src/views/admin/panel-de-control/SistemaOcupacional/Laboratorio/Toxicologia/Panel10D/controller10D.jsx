import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';

export const Loading = (text) => {
    Swal.fire({
      title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
      html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>` ,
      icon: 'info',
      background: '#f0f6ff',
      color: '#22223b',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
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


export const VerifyTR = async (nro,tabla,token,set,sede) => {
    if (!nro) { 
      await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error') 
      return
    }
    Loading('Validando datos')
    getFetch(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,token)
    .then((res) => {
        console.log(res)
        if (res.id === 0) {
            GetInfoPac(nro,set,token,sede)
        } else {
            console.log('falta que lobo haga la api')
            //GetInfoPanel2D(nro,tabla,set,token)
        }
    })
}

export const GetInfoPac = (nro,set,token,sede) => {
    getFetch(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`,token)
    .then((res) => {
        console.log('pros',res)
        set(prev => ({
        ...prev,
        ...res,
        paciente: res.nombresApellidos,
        }));
    })
    .finally(() => {
      Swal.close()
    })
}


export const GetInfoPanel2D = (nro,tabla,set,token) => {
  getFetch(`/api/v01/ct/inmunologia/obtenerReporteLgonadotropina?nOrden=${nro}&nameService=${tabla}`,token)
  .then((res) => {
    if (res.norden) {
        console.log(res)
      set(prev => ({
        ...prev,
        ...res,
        fecha: res.fechaExamen,
        resultado: res.txtResultado,
        positivo: res.resultado === 'POSITIVO' ? true : false,
        negativo: res.resultado === 'NEGATIVO' ? true : false,
      }));
    } else {
      Swal.fire('Error', 'Ocurrio un error al traer los datos','error')
    }
  })
  .finally(() => {
    Swal.close()
  })
}

export const SubmitPanel2D = async (form,user,token,limpiar,tabla) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos','error')
    return
  }
  Loading('Registrando Datos')
  SubmitLabAnalBio(form,user, token)
  .then((res) => {
    if (res.codAb) {
      Swal.fire({title: 'Exito', text:`Se ha Registrado/Actualizado con EXito,\n¿Desea imprimir?`, icon:'success', showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        limpiar()
        if (result.isConfirmed) {
          PrintHojaR(form.norden,tabla,token)
        }
      })
    }
  })
}

export const PrintHojaR = async (norden,tabla,token) => {
  Loading('Cargando Formato a Imprimir')
   // Ej: 'ConsentimientoPanel10D'
  getFetch(`/api/v01/ct/laboratorio/reporteAnalisisBioquimico?nOrden=${norden}&nameService=${tabla}`,token)
  .then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      const jasperModules = import.meta.glob('../../../../../../jaspers/AnalisisBioquimicos/*.jsx');
      const modulo = await jasperModules[`../../../../../../jaspers/AnalisisBioquimicos/${nombre}.jsx`]();
      // Ejecuta la función exportada por default con los datos
      if (typeof modulo.default === 'function') {
        modulo.default(res);
      } else {
        console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
      }
    }
  })
  .finally(() => {
    Swal.close()
  })
}