import Swal from "sweetalert2";
import {
  GetInfoServicioDefault,
  LoadingDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero, getHoraActual } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/exposicionCalor/obtenerReporte";
const registrarUrl = "/api/v01/ct/exposicionCalor/registrarActualizar";

// Reporte Jasper (un solo formato). El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob("../../../../jaspers/CertificadoExposicionAlCalor/*.jsx");
const rutaReporte = "../../../../jaspers/CertificadoExposicionAlCalor/CertificadoExposicionAlCalor.jsx";

const auditoriaVacia = {
  userRegistro: "",
  fechaRegistro: "",
  usuarioActualizacion: "",
  fechaActualizacion: "",
};

const dosDigitos = (n) => String(n ?? 0).padStart(2, "0");

// La hora (LocalTime) puede llegar como "HH:mm:ss", como [h, m, s] o como { hour, minute, second }.
const formatearHora = (hora) => {
  if (!hora) return "";
  if (typeof hora === "string") return hora;
  if (Array.isArray(hora)) return hora.slice(0, 3).map(dosDigitos).join(":");
  if (typeof hora === "object" && "hour" in hora) {
    return [hora.hour, hora.minute, hora.second].map(dosDigitos).join(":");
  }
  return "";
};

// Datos del paciente y de su empresa (el reporte llega envuelto en `resultado`). Son los mismos para un registro
// nuevo y para uno existente.
const mapearReporte = (rese) => ({
  norden: rese.norden ?? "",
  nombreExamen: rese.nombreExamen ?? "",
  nombres: `${rese.nombres ?? ""} ${rese.apellidosPaciente ?? ""}`.trim(),
  dni: rese.dni ?? "",
  edad: rese.edad ?? "",
  sexo: convertirGenero(rese.sexo),

  fechaNacimiento: formatearFechaCorta(rese.fechaNacimiento ?? ""),
  lugarNacimiento: rese.lugarNacimiento ?? "",
  estadoCivil: rese.estadoCivil ?? "",
  nivelEstudios: rese.nivelEstudios ?? "",

  empresa: rese.empresa ?? "",
  contrata: rese.contrata ?? "",
  ocupacion: rese.ocupacion ?? "",
  cargoDesempenar: rese.cargoDesempenar ?? "",
});

// Signos vitales precargados desde Triaje (solo en un registro nuevo): el texto de resultados y la interpretación
// de la observación.
// NOTA: la frecuencia respiratoria se mostraba en los resultados pero su interpretación nunca se agregó a las
// observaciones; se mantiene así.
const armarSignosVitales = (rese) => {
  const resultados =
    `-PA: SISTOLICA: ${rese.sistolica ?? "N/A"} / DIASTOLICA: ${rese.diastolica ?? "N/A"}\n` +
    `-FRECUENCIA CARDIACA: ${rese.fcardiaca ?? "N/A"}\n` +
    `-FRECUENCIA RESPIRATORIA: ${rese.frespiratoria ?? "N/A"}\n` +
    `-TEMPERATURA: ${rese.temperatura ?? "N/A"}\n` +
    `-SATURACIÓN DE OXIGENO: ${rese.saturacionOxigeno ?? "N/A"}`;

  let observacionSignosVitales = "";
  if (rese.sistolica !== "" && rese.diastolica !== "") {
    const sistolica = parseFloat(rese.sistolica);
    const diastolica = parseFloat(rese.diastolica);

    if (sistolica >= 140 || diastolica >= 90) {
      observacionSignosVitales = "- HTA NO CONTROLADA.\n";
    }
  }

  let frecuenciaCardiaca = "";
  if (rese.fcardiaca) {
    const fcardiaca = parseFloat(rese.fcardiaca);

    if (fcardiaca >= 40 && fcardiaca <= 49) {
      frecuenciaCardiaca = "- FRECUENCIA CARDIACA: BRADICARDIA.\n";
    } else if (fcardiaca >= 50 && fcardiaca <= 99) {
      frecuenciaCardiaca = "- FRECUENCIA CARDIACA: NORMAL.\n";
    } else if (fcardiaca >= 100 && fcardiaca <= 250) {
      frecuenciaCardiaca = "- FRECUENCIA CARDIACA: TAQUICARDIA.\n";
    }
  }

  let estadoTemperatura = "";
  if (rese.temperatura) {
    const temperatura = parseFloat(rese.temperatura);

    if (temperatura >= 17 && temperatura <= 28) {
      estadoTemperatura = "- HIPOTERMIA PROFUNDA";
    } else if (temperatura >= 29 && temperatura <= 35) {
      estadoTemperatura = "- HIPOTERMIA LIGERA";
    } else if (temperatura >= 36 && temperatura <= 37.4) {
      estadoTemperatura = "- TEMPERATURA: NORMAL.\n";
    } else if (temperatura >= 37.5 && temperatura <= 37.9) {
      estadoTemperatura = "- TEMPERATURA: FEBRICULA.\n";
    } else if (temperatura >= 38 && temperatura <= 38.9) {
      estadoTemperatura = "- TEMPERATURA: FIEBRE.\n";
    } else if (temperatura >= 39 && temperatura <= 39.9) {
      estadoTemperatura = "- TEMPERATURA: FIEBRE ALTA.\n";
    } else if (temperatura >= 40 && temperatura <= 41.5) {
      estadoTemperatura = "- FIEBRE MUY ALTA";
    }
  }

  return {
    resultados,
    observaciones:
      observacionSignosVitales +
      frecuenciaCardiaca +
      estadoTemperatura +
      "- SATURACIÓN DE OXIGENO: NORMAL.",
  };
};

// ===== Registro nuevo =====
export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { },
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish,
  );
  // El reporte llega envuelto en `resultado` (si algún día llega plano, se lee igual).
  const rese = res?.resultado ?? res;
  if (rese) {
    const signosVitales = armarSignosVitales(rese);

    set((prev) => ({
      ...prev,
      ...mapearReporte(rese),
      id: null,
      fecha: rese.fecha || prev.fecha,
      hora: "",

      signosVitalesResultados: signosVitales.resultados,
      signosVitalesObservaciones: signosVitales.observaciones,

      ...auditoriaVacia,
      tieneRegistro: false,
    }));
  }
};

// ===== Registro existente =====
export const GetInfoServicioEditar = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { },
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish,
    true,
  );
  const rese = res?.resultado ?? res;
  if (rese) {
    set((prev) => ({
      ...prev,
      ...mapearReporte(rese),
      fecha: rese.fecha ?? prev.fecha,
      hora: formatearHora(rese.hora),

      signosVitalesResultados: rese.signosVitalesResultados ?? "",
      signosVitalesObservaciones: rese.signosVitalesObservaciones ?? "",
      sistemaCardiovascularResultados: rese.sistemaCardiovascularResultados ?? "",
      sistemaCardiovascularObservaciones: rese.sistemaCardiovascularObservaciones ?? "",
      sistemaRespiratorioResultados: rese.sistemaRespiratorioResultados ?? "",
      sistemaRespiratorioObservaciones: rese.sistemaRespiratorioObservaciones ?? "",
      estadoNeurologicoResultados: rese.estadoNeurologicoResultados ?? "",
      estadoNeurologicoObservaciones: rese.estadoNeurologicoObservaciones ?? "",
      estadoHidratacionResultados: rese.estadoHidratacionResultados ?? "",
      estadoHidratacionObservaciones: rese.estadoHidratacionObservaciones ?? "",
      toleranciaCalorResultados: rese.toleranciaCalorResultados ?? "",
      toleranciaCalorObservaciones: rese.toleranciaCalorObservaciones ?? "",
      sudoracionResultados: rese.sudoracionResultados ?? "",
      sudoracionObservaciones: rese.sudoracionObservaciones ?? "",

      aptitud: rese.esApto
        ? "APTO"
        : rese.noEsApto
          ? "NO APTO"
          : rese.aptoRestriccion
            ? "RESTRICCION"
            : "",

      observaciones: rese.observaciones ?? "",
      restricciones: rese.restricciones ?? "",

      // El reporte trae el médico como `user_medicoFirma` (el nombre lo completa el combo desde la lista de empleados).
      user_medicoFirma: rese.user_medicoFirma
        ? rese.user_medicoFirma
        : prev.user_medicoFirma,

      // Auditoría. CertificadoExposicionCalorReporteDTO solo devuelve quién registró (`userRegistro`): no trae
      // fechas de registro/edición ni quién editó (la sección las muestra como "—"). Si el backend los agrega,
      // se leen solos.
      userRegistro: rese.userRegistro ?? "",
      fechaRegistro: rese.fechaRegistro ?? "",
      usuarioActualizacion: rese.usuarioActualizacion ?? "",
      fechaActualizacion: rese.fechaActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

// ===== Mapeo: Body =====
// CertificadoExposicionCalorDTO usa `userRegistro` para el usuario que registra y NO declara fechas de registro /
// actualización, por eso no se sella auditoría (sellarAuditoria agregaría campos que el DTO no tiene). Al editar se
// reenvía el creador y la hora de registro que devolvió el reporte (así no se pisan con quien edita ni con la hora de
// la edición); si no vinieron, el usuario en sesión y la hora actual. El reporte no devuelve `id` (el backend
// actualiza por N° Orden).
const construirBody = (form, user, esActualizacion) => ({
  norden: form.norden,
  id: form.id,
  fecha: form.fecha,

  horaRegistro: esActualizacion && form.hora ? form.hora : getHoraActual(),

  signosVitalesResultados: form.signosVitalesResultados,
  signosVitalesObservaciones: form.signosVitalesObservaciones,
  sistemaCardiovascularResultados: form.sistemaCardiovascularResultados,
  sistemaCardiovascularObservaciones: form.sistemaCardiovascularObservaciones,
  sistemaRespiratorioResultados: form.sistemaRespiratorioResultados,
  sistemaRespiratorioObservaciones: form.sistemaRespiratorioObservaciones,
  estadoNeurologicoResultados: form.estadoNeurologicoResultados,
  estadoNeurologicoObservaciones: form.estadoNeurologicoObservaciones,
  estadoHidratacionResultados: form.estadoHidratacionResultados,
  estadoHidratacionObservaciones: form.estadoHidratacionObservaciones,
  toleranciaCalorResultados: form.toleranciaCalorResultados,
  toleranciaCalorObservaciones: form.toleranciaCalorObservaciones,
  sudoracionResultados: form.sudoracionResultados,
  sudoracionObservaciones: form.sudoracionObservaciones,

  esApto: form.aptitud == "APTO",
  aptoRestriccion: form.aptitud == "RESTRICCION",
  noEsApto: form.aptitud == "NO APTO",

  observaciones: form.observaciones,
  restricciones: form.restricciones,

  usuarioFirma: form.user_medicoFirma,
  userRegistro: esActualizacion ? (form.userRegistro || user) : user,
});

// La aptitud es obligatoria tanto al guardar como al editar.
const datosCompletos = async (form) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return false;
  }
  if (form.aptitud == "") {
    await Swal.fire("Advertencia", "Debe seleccionar la aptitud", "warning");
    return false;
  }
  return true;
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!(await datosCompletos(form))) return;
  await guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!(await datosCompletos(form))) return;
  await actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
  });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

// No se usa `imprimirReporteJasper`: este reporte llega envuelto en `resultado` y ese util valida `norden` en la raíz.
export const PrintHojaR = (nro, token, tabla) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token,
  )
    .then(async (res) => {
      const datos = res?.resultado ?? res;
      if (!datos?.norden) {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
          html: `No se encontraron registros para el N° Orden ${nro}.`,
        });
        return;
      }
      const modulo = await jasperModules[rutaReporte]();
      if (typeof modulo.default === "function") {
        modulo.default(datos);
        Swal.close();
      } else {
        console.error("El reporte de Certificado de Exposición al Calor no exporta una función por defecto");
        Swal.fire({
          icon: "error",
          title: '<i class="fa-solid fa-print"></i>Error',
          html: "No se pudo cargar el formato de impresión.",
        });
      }
    })
    .catch((error) => {
      console.error("Error al generar el reporte:", error);
      Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-print"></i>Error',
        html: "Ocurrió un error al generar el reporte.",
      });
    });
};

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente / necesita Triaje.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    // NO tiene registro
    onNuevo: () =>
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
      }),
    // SÍ tiene registro
    onExistente: () =>
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Certificado Exposicion Al Calor.",
          "warning",
        );
      }),
    // Necesita su Triaje antes de registrar.
    onNecesitaExamen: () =>
      Swal.fire("Alerta", "El paciente necesita pasar por Triaje.", "warning"),
  });

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
