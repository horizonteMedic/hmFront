import Swal from "sweetalert2";
import { getFetch } from '../../../../getFetch/getFetch.js';
import { GetInfoLaboratioEx } from '../Controller/model.js';

const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style="font-size:1.1em;"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
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

export const VerifyTR = async (nro, tabla, token, set, sede) => {
  if (!nro) {
    await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error')
    return
  }
  Loading('Validando datos')
  getFetch(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`, token)
    .then((res) => {
      if (res.id === 0) {
        GetInfoPac(nro, set, token, sede)
      } else if (res.id === 1) {
        GetInfoPacLaboratorioFil(nro, tabla, set, token)
      } else {
        Swal.fire("Error", "Ocurrio un error", "error")
      }
    })
}

export const GetInfoPac = (nro, set, token, sede) => {
  getFetch(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`, token)
    .then((res) => {
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

export const GetInfoPacLaboratorioFil = (nro, tabla, set, token,user) => {
  getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${nro}&nameConset=${tabla}`, token)
    .then((res) => {
      if (res.norden) {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Consentimiento Muestra de Sangre",
          "warning"
        )
        set(prev => ({
          ...prev,
          ...res,
          user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
          nombre_doctorAsignado: res.doctorAsignado ?? "",
          user_doctorAsignado: res.userMedicoOcup ?? "",

        }));
      } else {
        Swal.fire('Error', 'Ocurrio un error al traer los datos', 'error')
      }
    })
    .finally(() => {
      Swal.close()
    })
}

export const SubmitConsentimientoLab = async (form, tabla, token, user, limpiar = null) => {
  if (!form.norden) {
    await Swal.fire('Error', 'Datos Incompletos', 'error')
    return
  }
  Loading('Registrando Datos')
  GetInfoLaboratioEx(form, tabla, token, user)
    .then((res) => {
      if (res.id === 1 || res.id === 0) {
        Swal.fire({
          title: 'Exito', text: `${res.mensaje},\n¿Desea imprimir?`, icon: 'success', showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (limpiar) limpiar()
          if (result.isConfirmed) {
            PrintHojaR(form, tabla, token)
          }
        })
      } else {
        Swal.fire('Error', 'Ocurrio un error al Registrar', 'error')
      }
    })
    .catch(() => {
      Swal.fire('Error', 'Ocurrio un error al Registrar', 'error')
    })
}

export const PrintHojaR = async (datos, tabla, token) => {
  Loading('Cargando Formato a Imprimir')
  getFetch(`/api/v01/ct/laboratorio/consentimiento-laboratorio?nOrden=${datos.norden}&nameConset=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        const nombre = res.nameJasper;
        const jasperModules = import.meta.glob('../../../../../../jaspers/Consentimientos/*.jsx');
        const modulo = await jasperModules[`../../../../../../jaspers/Consentimientos/${nombre}.jsx`]();
        if (typeof modulo.default === 'function') {
          modulo.default(res);
        } else {
          console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
        }
        Swal.close()
      }
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "N° Orden no existente",
        text: "Por favor, ingrese un N° Orden válido.",
      });
    });
}

