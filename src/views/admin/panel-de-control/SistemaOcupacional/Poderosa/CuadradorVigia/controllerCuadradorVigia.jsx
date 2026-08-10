import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../../utils/functionUtils";
import { getFetch } from "../../../../../utils/apiHelpers";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../../utils/helpers";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
} from "../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/certificadoAptitudCuadrador/obtenerReporte";
const registrarUrl = "/api/v01/ct/certificadoAptitudCuadrador/registrarActualizar";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/*.jsx");
const rutaReporte = "../../../../../jaspers/Poderosa/CertificadoAptitudCuadrador.jsx";

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
        explotacion: res.explotacion ?? "",
        // Datos personales
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        lugarNacimiento: res.lugarNacimiento ?? "",
        estadoCivil: res.estadoCivil ?? "",
        nivelEstudios: res.nivelEstudios ?? "",
        dni: res.dni ?? "",
        edad: res.edad ?? "",
        sexo: convertirGenero(res.genero),
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        // Datos laborales
        cargoDesempenar: res.cargo ?? "",
        ocupacion: res.areaO ?? "",
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
// A diferencia del resto de formularios Poderosa, este backend envuelve la respuesta del
// reporte dentro de la clave "resultado" (no en el nivel raíz).
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    const rese = res?.resultado;
    if (!rese) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: rese.norden ?? prev.norden,
        nombreExamen: rese.tipoExamen ?? prev.nombreExamen,
        explotacion: rese.explotacion ?? "",
        // Datos personales
        nombres: `${rese.nombres ?? ""} ${rese.apellidos ?? ""}`.trim(),
        dni: rese.dniPaciente ?? "",
        edad: rese.edad ?? "",
        sexo: convertirGenero(rese.sexoPaciente),
        fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
        estadoCivil: rese.estadoCivilPaciente ?? "",
        nivelEstudios: rese.nivelEstudioPaciente ?? "",
        // Datos laborales
        empresa: rese.empresa ?? "",
        contrata: rese.contrata ?? "",
        cargoDesempenar: rese.cargoPaciente ?? "",
        ocupacion: rese.ocupacionPaciente ?? "",
        // Aptitud / observaciones
        fechaExamen: rese.fechaExamen ?? prev.fechaExamen,
        fechaHasta: rese.fechaCaducidad ?? prev.fechaHasta,
        observaciones: rese.observacion ?? "",
        apto: rese.apto ? "APTO" :
            rese.aptoConRestriccion ? "APTO_CON_RESTRICCION" :
                rese.aptoTemporal ? "APTO_TEMPORAL" :
                    rese.noApto ? "NO_APTO" : "",
        // Doctor asignado: solo se guarda el id (username); EmpleadoComboBox resuelve el nombre.
        user_doctorAsignado: rese.doctorAsignado ? rese.doctorAsignado : prev.user_doctorAsignado,
        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        // La creación se conserva para reenviarla al editar y que el backend no la borre.
        fechaRegistro: rese.fechaRegistro ?? "",
        userRegistro: rese.userRegistro ?? "",
        fechaActualizacion: rese.fechaActualizacion ?? "",
        usuarioActualizacion: rese.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fechaExamen,
    fechaCaducidad: form.fechaHasta,
    apto: form.apto === "APTO",
    aptoConRestriccion: form.apto === "APTO_CON_RESTRICCION",
    aptoTemporal: form.apto === "APTO_TEMPORAL",
    noApto: form.apto === "NO_APTO",
    explotacion: form.explotacion,
    doctorAsignado: form.user_doctorAsignado,
    observacion: form.observaciones,
});

// Body completo (creación / actualización). Este endpoint espera la clave "userRegistro"
// (el default de sellarAuditoria), igual que enviaba el código legacy.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });

// ===== Impresión =====
// No se puede usar el helper genérico `imprimirReporteJasper` (registroOcupacionalUtils) porque
// este backend anida el reporte en "resultado" en vez de devolverlo en el nivel raíz.
export const PrintHojaR = async (nro, token, tabla, datosFooter, sede) => {
    LoadingDefault("Cargando Formato a Imprimir");

    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a otra sede${descripcionSede ? ` (${descripcionSede})` : ""}.`,
            });
            return;
        }
        if (estado === "noEncontrado") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
                html: `No se encontraron registros para el N° Orden ${nro}.`,
            });
            return;
        }
        if (estado === "error") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    const res = await getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token);
    const rese = res?.resultado;
    if (!rese?.norden) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontraron registros para el N° Orden ${nro}.`,
        });
        return;
    }

    const modulo = await jasperModules[rutaReporte]();
    if (typeof modulo.default === "function") {
        modulo.default({ ...rese, ...datosFooter });
        Swal.close();
    } else {
        console.error(`El módulo ${rutaReporte} no exporta una función por defecto`);
        Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-print"></i>Error',
            html: "No se pudo cargar el formato de impresión.",
        });
    }
};

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
                    html: "Este paciente ya cuenta con registros de Cuadrador Vigía",
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
