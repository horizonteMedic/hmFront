import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    actualizarRegistro,
    guardarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/hojaRutaEmo/obtenerReporteHojaRuta";
const registrarUrl = "/api/v01/ct/hojaRutaEmo/registrarActualizar";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/Poderosa/HojaDeRutaEmo_Digitalizado.jsx";

// ===== Mapeo del reporte (nuevo y edición usan el mismo origen de datos) =====
// A diferencia de otros formularios Poderosa, la Hoja de Ruta no tiene un estado "en blanco":
// el reporte agrega en vivo los datos de las distintas especialidades (medicina, psicología,
// visual, audiometría, etc.) desde sus propias tablas, exista o no todavía una fila propia en
// "hoja_ruta_emo". Por eso ambos casos (nuevo/existente) leen del mismo obtenerReporte; lo único
// que cambia es `tieneRegistro` (que decide si se Guarda o se Edita al enviar).
const mapReporte = async (nro, tabla, set, token, onFinish, tieneRegistro) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish, true);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? prev.norden,
        tipoExamen: res.tipoExamen ?? prev.tipoExamen,
        fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        horaSalida: res.horaSalida ?? prev.horaSalida,
        horaEntrada: res.horaEntrada ?? prev.horaEntrada,
        // Datos personales
        nombres: res.nombreCompletoPaciente ?? "",
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        // Vitales (solo lectura, provienen de Triaje)
        peso: res.peso ?? "",
        talla: res.talla ?? "",
        pa: res.pa ?? "",
        sat02: res.sat02 ?? "",
        cintura: res.cintura ?? "",
        cadera: res.cadera ?? "",
        fc: res.fc ?? "",
        fr: res.fr ?? "",
        cuello: res.cuello ?? "",
        // Especialistas por examen (solo lectura)
        usuarioEvaluacionMedica: res.usuarioEvaluacionMedica ?? "",
        usuarioInformeBrigadista: res.usuarioInformeBrigadista ?? "",
        usuarioEvaluacionOftalmologica: res.usuarioEvaluacionOftalmologica ?? "",
        usuarioAudiometria: res.usuarioAudiometria ?? "",
        usuarioEspirometria: res.usuarioEspirometria ?? "",
        usuarioToraxConvencional: res.usuarioToraxConvencional ?? "",
        usuarioElectrocardiograma: res.usuarioElectrocardiograma ?? "",
        usuarioExamenLaboratorio: res.usuarioExamenLaboratorio ?? "",
        usuarioCertificadoAptitudBrigadista: res.usuarioCertificadoAptitudBrigadista ?? "",
        // Observaciones por examen (editables)
        observacionesEvaluacionMedica: res.observacionesEvaluacionMedica ?? "",
        observacionInformeBrigadista: res.observacionInformeBrigadista ?? "",
        observacionesEvaluacionVisual: res.observacionesEvaluacionVisual ?? "",
        observacionAudiometria: res.observacionAudiometria ?? "",
        observacionEspirometria: res.observacionEspirometria ?? "",
        observacionRadiografiaTorax: res.observacionRadiografiaTorax ?? "",
        observacionesElectrocardiograma: res.observacionesElectrocardiograma ?? "",
        observacionesExamenLaboratorio: res.observacionesExamenLaboratorio ?? "",
        observacionBrigadista: res.observacionBrigadista ?? "",
        // Conclusiones generales
        observacionesGenerales: res.observacionesGenerales ?? "",
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro,
    }));
};

export const GetInfoServicio = (nro, tabla, set, token, onFinish = () => { }) =>
    mapReporte(nro, tabla, set, token, onFinish, false);

export const GetInfoServicioEditar = (nro, tabla, set, token, onFinish = () => { }) =>
    mapReporte(nro, tabla, set, token, onFinish, true);

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fechaExamen,
    usuarioFirma: form.user_medicoFirma,
    horaSalida: getHoraActual(),
    observacionesGenerales: form.observacionesGenerales,
    observacionesMedicina: form.observacionesEvaluacionMedica,
    observacionesPsicologia: form.observacionInformeBrigadista,
    observacionesVisual: form.observacionesEvaluacionVisual,
    observacionesAudiometria: form.observacionAudiometria,
    observacionesEspirometria: form.observacionEspirometria,
    observacionesRadiografiaTorax: form.observacionRadiografiaTorax,
    observacionesCardiologia: form.observacionesElectrocardiograma,
    observacionesLaboratorio: form.observacionesExamenLaboratorio,
    observacionesBrigadista: form.observacionBrigadista,
});

const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Búsqueda / verificación por N° Orden =====
// Igual que en TrabajosCaliente/LicenciaInterna: 3 estados (nuevo / existente / necesita
// Triaje), con validación de sede previa. En ambos estados "nuevo" y "existente" se usa el
// mismo obtenerReporte (ver mapReporte); solo cambia `tieneRegistro` y el aviso mostrado.
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    LoadingDefault("Validando datos");

    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
            });
            return;
        }
        if (estado !== "ok") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => GetInfoServicio(nro, tabla, set, token, () => Swal.close()),
        () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Hoja Ruta EMO",
                });
            }),
        () => {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-eye"></i>Alerta',
                html: "El paciente necesita pasar por Triaje.",
            });
        }
    );
};
