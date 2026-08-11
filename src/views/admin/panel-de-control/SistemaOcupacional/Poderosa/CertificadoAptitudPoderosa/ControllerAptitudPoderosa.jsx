import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { convertirGenero } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/aptitudAltura/obtenerReporteAptitudAlturaPoderosa";
const registrarUrl = "/api/v01/ct/aptitudAltura/registrarActualizarAptitudAlturaPoderosa";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/AptitupAlturaPoderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/AptitupAlturaPoderosa/Aptitud_Poderosa_Digitalizado.jsx";

// ===== Mapeo del reporte (nuevo y edición usan el mismo origen de datos) =====
// A diferencia de otros formularios Poderosa, este examen no consulta "busquedaPorFiltros": usa
// directamente el reporte agregado (el backend ya trae los datos de Triaje/Oftalmología/Lab
// aunque aún no exista una fila propia en "aptitud_altura_poderosa"). Los campos de Agudeza
// Visual y Laboratorio son de solo lectura y conservan el nombre crudo de columna del backend
// (se copian tal cual con el spread); solo se traducen explícitamente los campos que sí cambian
// de nombre o requieren cálculo.
const mapReporte = async (nro, tabla, set, token, onFinish, tieneRegistro) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish, true);
    if (!res) return;
    set((prev) => ({
        ...prev,
        ...res,
        // Header
        norden: res.norden ?? prev.norden,
        nombreExamen: res.nombreExamen ?? "",
        fechaExamen: tieneRegistro ? (res.fechaExamen ?? prev.fechaExamen) : prev.fechaExamen,
        fechaHasta: tieneRegistro ? (res.fechaHasta ?? prev.fechaHasta) : prev.fechaHasta,
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ? `${res.edadPaciente} AÑOS` : "",
        sexo: convertirGenero(res.sexoPaciente),
        fechaNacimiento: res.fechaNacimientoPaciente ?? "",
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        // Enfermedades oculares: 2 columnas del backend concatenadas en un solo campo.
        enfermedadesOcularesOftalmo_e_oculares: `${res.enfermedadesOcularesOftalmo_e_oculares ?? ""}\n${res.enfermedadesocularesotrosoftalmo_e_oculares1 ?? ""}`,
        // Aptitud: solo se precarga en un registro existente (un registro nuevo no debe heredar
        // un veredicto de aptitud de otro examen).
        apto: tieneRegistro
            ? (res.apto ? "APTO" : res.aptoRestriccion ? "APTOCONRESTRICCION" : res.aptoTemporal ? "NOAPTOTEMPORAL" : res.noApto ? "NOAPTO" : "")
            : prev.apto,
        observaciones: tieneRegistro ? (res.observaciones ?? "") : prev.observaciones,
        nombre_medico: tieneRegistro ? (res.nombreMedico ?? prev.nombre_medico) : prev.nombre_medico,
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
    dni: form.dni,
    fechaExamen: form.fechaExamen,
    fechaHasta: form.fechaHasta,
    nombreMedico: form.nombre_medico,
    apto: form.apto === "APTO",
    aptoRestriccion: form.apto === "APTOCONRESTRICCION",
    noAptoTemporal: form.apto === "NOAPTOTEMPORAL",
    noApto: form.apto === "NOAPTO",
    observaciones: form.observaciones,
    usuarioFirma: form.user_medicoFirma,
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
// A diferencia del patrón binario nuevo/existente (verificarRegistro), este examen exige que
// el paciente haya pasado Triaje (Agudeza Visual) antes de poder registrarse. Se reutiliza
// VerifyTRPerzonalizadoDefault (3 estados: nuevo / existente / necesita Triaje) anteponiendo
// la validación de sede, igual que en el resto de formularios Poderosa.
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
                    html: "Este paciente ya cuenta con registros de C. de Aptitud Altura Poderosa",
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
