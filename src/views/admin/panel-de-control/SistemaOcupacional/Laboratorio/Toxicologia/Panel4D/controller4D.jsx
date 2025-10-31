import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';
import { SubmitToxPanel4D } from "../model/model.js";

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
            GetInfoPanel4D(nro,tabla,set,token)
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
        nombres: res.nombresApellidos,
        }));
    })
    .finally(() => {
      Swal.close()
    })
}

export const GetInfoPanel4D = (nro,tabla,set,token) => {
  console.log(token)
  getFetch(`/api/v01/ct/toxicologia/obtenerReportePanel4D?nOrden=${nro}&nameService=${tabla}`,token)
  .then((res) => {
    if (res.norden) {
       Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Panel 4D",
          "warning"
      )
      set(prev => ({
        ...prev,
        ...res,
        fecha: res.fechaExamen,
        valueC: res.txtrCocaina,
        valueM: res.txtrMarihuana,
        valueO: res.txtrOpiaceos,
        valueMet: res.txtrMethanfetamina,
      }));
    } else {
      Swal.fire('Error', 'Ocurrio un error al traer los datos','error')
    }
  })
  .finally(() => {
    Swal.close()
  })
}

export const SubmitPanel4D = async (form,user,token,limpiar,tabla) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos','error')
    return
  }
  Loading('Registrando Datos')
  SubmitToxPanel4D(form,user, token)
  .then((res) => {
    if (res.success) {
      Swal.fire({
        title: 'Éxito',
        text: 'Datos registrados correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        limpiar()
      })
    } else {
      Swal.fire('Error', res.message || 'Error al registrar datos', 'error')
    }
  })
  .catch((error) => {
    console.error('Error:', error)
    Swal.fire('Error', 'Error al registrar datos', 'error')
  })
  .finally(() => {
    Swal.close()
  })
}

export const PrintHojaR = (nro,tabla,token) => {
  Loading('Generando Reporte')
  getFetch(`/api/v01/ct/toxicologia/generarReportePanel4D?nOrden=${nro}&nameService=${tabla}`,token)
  .then((res) => {
    if (res.success) {
      Swal.fire({
        title: 'Éxito',
        text: 'Reporte generado correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    } else {
      Swal.fire('Error', res.message || 'Error al generar reporte', 'error')
    }
  })
  .catch((error) => {
    console.error('Error:', error)
    Swal.fire('Error', 'Error al generar reporte', 'error')
  })
  .finally(() => {
    Swal.close()
  })
}
