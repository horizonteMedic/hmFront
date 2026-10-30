import { getFetch } from "../../../getFetch/getFetch";
import Swal from "sweetalert2";
import { construirBodyOIT, construirBodyOITSinDatos } from "./model";
import OIT_B_Digitalizado from "../../../../../jaspers/OIT/OIT_B_Digitalizado";
import OIT_B_Digitalizado_boro from "../../../../../jaspers/OIT/OIT_B_Digitalizado_boro";
import { handleSubidaMasiva, handleSubirArchivoDefaultSinSellos, ReadArchivosFormDefault, VerifyTRPerzonalizadoDefault } from "../../../../../utils/functionUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import { guardarRegistro, actualizarRegistro, validarSede } from "../../../../../utils/registroOcupacionalUtils";

const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta"
const registrarUrl = "/api/v01/ct/oit/registrarActualizarOit"

// nameService del examen (también lo usa Auditoría de Protocolos para abrir el reporte)
export const TABLA_OIT = "oit";

const Loading = (text) => {
  Swal.fire({
    title: `<span style="font-size:1.3em;font-weight:bold;">${text}</span>`,
    html: `<div style=\"font-size:1.1em;\"><span style='color:#0d9488;font-weight:bold;'></span></div><div class='mt-2'>Espere por favor...</div>`,
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

// export const VerifyTR = async (nro, tabla, token, set, sede) => {
//   if (!nro) {
//     await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error')
//     return
//   }
//   Loading('Validando datos')
//   getFetch(`/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`, token)
//     .then((res) => {
//       console.log(res)
//       if (res.id === 0) {
//         GetInfoPac(nro, set, token, sede)
//       } else {
//         GetInfoPacLaboratorioFil(nro, tabla, set, token)
//       }
//     })
// }

// `silencioso`: al encontrar un registro existente solo cierra el "Validando datos", sin el aviso de
// "ya cuenta con registros" (formulario incrustado, donde el estado del registro ya se ve en pantalla).
export const VerifyTR = async (nro, tabla, token, set, sede, { silencioso = false } = {}) => {
  if (!nro) {
    await Swal.fire('Error', 'Debe Introducir un Nro de Historia Clinica valido', 'error')
    return
  }

  Loading('Validando datos')

  // Como el resto de formularios de la plantilla: el N° Orden debe pertenecer a la sede actual.
  if (sede) {
    const { estado, descripcionSede } = await validarSede(nro, sede, token)
    if (estado === "otraSede") {
      Swal.fire({
        icon: "warning",
        title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
        html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
      })
      return
    }
    if (estado !== "ok") {
      Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
        html: `Verifique el número de orden ${nro} e intente nuevamente.`,
      })
      return
    }
  }

  VerifyTRPerzonalizadoDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    () => {
      //NO Tiene registro
      GetInfoPac(nro, set, token, sede)
      set(prev => ({
        ...prev,
        aPruebaDeSoledad: true,
      }))
    },
    () => {
      GetInfoPacLaboratorioFil(nro, tabla, set, token, { silencioso })
      set(prev => ({
        ...prev,
        aPruebaDeSoledad: true,
      }))
    },
    () => {
      //Necesita Agudeza visual 
      Swal.fire(
        "Alerta",
        "El paciente necesita pasar por Rayos X Torax.",
        "warning"
      );
    }
  );
};

export const GetInfoPac = (nro, set, token, sede) => {
  return getFetch(`/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros?nOrden=${nro}&nomSede=${sede}`, token)
    .then((res) => {
      console.log('pros', res)
      set(prev => ({
        ...prev,
        ...res,
        nombres: res.nombresApellidos,
        txtSComentarios: `${res.conclusionesRadiograficas ? res.conclusionesRadiograficas + "\n" : ""}`,

      }));
    })
    .finally(() => {
      Swal.close()
    })
}

export const GetInfoPacLaboratorioFil = (nro, tabla, set, token, { silencioso = false } = {}) => {
  getFetch(`/api/v01/ct/oit/obtenerReporteOit?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      console.log(res)
      set(prev => ({
        ...prev,
        ...res,
        SubirDoc: true,
        digitalizacion: res.digitalizacion,
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // OitReporteDTO aún no devuelve fecha de registro ni datos de edición: mientras tanto quedan vacíos.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
      }))
    })
    .finally(() => {
      if (silencioso) {
        Swal.close()
        return
      }
      Swal.fire(
        "Alerta",
        "Este paciente ya cuenta con registros de OIT",
        "warning"
      );
    })
}

// Body completo (creación / actualización). OitDTO usa `userRegistro` para el usuario que registra.
// El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el creador,
// se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(form.SinDatos ? construirBodyOITSinDatos(form) : construirBodyOIT(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro || user,
    fechaRegistro: form.fechaRegistro,
  })

// Este endpoint responde id 1 al registrar y 0 al actualizar.
const idsExito = [0, 1]

const imprimir = (form, token, tabla) => () =>
  form.SinDatos ? PrintHojaSinDatos(form.norden, token, tabla) : PrintHojaR(form.norden, token, tabla)

// ===== Guardar (registro nuevo) =====
export const SubmitOIT = (form, token, user, limpiar, tabla) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: imprimir(form, token, tabla),
    idsExito,
  })

// ===== Editar (registro existente) =====
export const UpdateOIT = (form, token, user, limpiar, tabla) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: imprimir(form, token, tabla),
    idsExito,
  })

export const PrintHojaR = (nro, token, tabla) => {
  Loading('Cargando Formato a Imprimir')
  getFetch(`/api/v01/ct/oit/obtenerReporteOit?nOrden=${nro}&nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res)
        const nombre = res.nameJasper;
        console.log(nombre)
        const jasperModules = import.meta.glob('../../../../../jaspers/OIT/*.jsx');
        const modulo = await jasperModules[`../../../../../jaspers/OIT/${nombre}.jsx`]();
        // Ejecuta la función exportada por default con los datos
        if (typeof modulo.default === 'function') {
          modulo.default(res);
        } else {
          console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
        }
        Swal.close()
      } else {
        Swal.close()
      }
    })
}

export const PrintHojaSinDatos = (nro, token, tabla) => {
  Loading('Cargando Formato a Imprimir')
  getFetch(`/ api / v01 / ct / oit / obtenerReporteOit ? nOrden = ${nro} & nameService=${tabla}`, token)
    .then(async (res) => {
      if (res.norden) {
        console.log(res)
        const nombre = res.nameJasper;
        console.log(nombre)
        if (nombre === 'OIT_Digitalizado_boro') {
          OIT_B_Digitalizado_boro(res)
          Swal.close()
        } else {
          OIT_B_Digitalizado(res)
          Swal.close()
        }
      } else {
        Swal.close()
      }
    })
}

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token, nomenclatura) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token, nomenclatura)
}