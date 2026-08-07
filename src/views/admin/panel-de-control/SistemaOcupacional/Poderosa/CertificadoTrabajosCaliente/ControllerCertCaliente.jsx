import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getHoraActual } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/aptitudCertificadoCaliente/obtenerReporteAptitudCertificadoCaliente";
const registrarUrl = "/api/v01/ct/aptitudCertificadoCaliente/registrarActualizarAptitudCertificadoCaliente";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/AptitudCertificadoCaliente/*.jsx");
const rutaReporte = "../../../../../jaspers/AptitudCertificadoCaliente/Aptitud_Trabajos_EnCaliente_Digitalizado.jsx";

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    // Norden inexistente / paciente no encontrado / error del backend.
    if (!res || res.error || !res.norden) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontró ningún registro con el N° Orden ${nro}.`,
        });
        return;
    }
    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        nombreExamen: res.nomExam ?? "",
        fechaExamen: prev.fechaExamen ?? "",
        // Datos personales
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        // Datos laborales
        cargoDesempenar: res.cargo ?? "",
        ocupacion: res.areaO ?? "",
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? prev.norden,
        nombreExamen: res.nombreExamen ?? prev.nombreExamen,
        fechaExamen: res.fechaExamen ?? prev.fechaExamen,
        fechaHasta: res.fechaHasta ?? prev.fechaHasta,
        horaSalida: res.horaSalida ?? prev.horaSalida,
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
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
        // Aptitud / observaciones
        apto: res.apto ? "APTO" : res.aptoRestriccion ? "APTOCONRESTRICCION" : res.noAptoTemporal ? "NOAPTOTEMPORAL" : res.noApto ? "NOAPTO" : "",
        observaciones: res.observaciones ?? "",
        nombre_medico: res.nombreMedico ?? prev.nombre_medico,
        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fechaExamen,
    fechaHasta: form.fechaHasta,
    nombreMedico: form.nombre_medico,
    apto: form.apto === "APTO",
    aptoRestriccion: form.apto === "APTOCONRESTRICCION",
    noAptoTemporal: form.apto === "NOAPTOTEMPORAL",
    noApto: form.apto === "NOAPTO",
    observaciones: form.observaciones,
    horaSalida: getHoraActual(),
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). Este endpoint espera la clave "usuarioRegistro"
// (no "userRegistro") para el usuario que crea el registro.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
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
        () => GetInfoServicio(nro, set, token, sede),
        () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de C. Trabajos en Caliente",
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
