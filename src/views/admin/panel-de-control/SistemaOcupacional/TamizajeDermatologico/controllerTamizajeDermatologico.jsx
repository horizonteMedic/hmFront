import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/tamizajeDermatologico/obtenerReporte";
const registrarUrl = "/api/v01/ct/tamizajeDermatologico/registrarActualizar";

// Reporte Jasper (un solo formato). El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob("../../../../jaspers/TamizajeDermatologico/*.jsx");
const rutaReporte = "../../../../jaspers/TamizajeDermatologico/TamizajeDermatologico.jsx";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    // El reporte llega envuelto en `resultado` (si algún día llega plano, se lee igual).
    const rese = res?.resultado ?? res;
    if (rese) {
        set((prev) => ({
            ...prev,
            // Header - Información del examen
            norden: rese.norden ?? "",
            fecha: rese.fechaExamen ?? prev.fecha,
            nombreExamen: rese.nomExamen ?? "",

            dni: rese.dniPaciente ?? "",
            nombres: `${rese.nombres ?? ""} ${rese.apellidos ?? ""}`.trim(),
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            edad: rese.edad ?? "",
            sexo: convertirGenero(rese.sexoPaciente ?? ""),
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",

            // Datos Laborales
            empresa: rese.razonEmpresa ?? "",
            contrata: rese.razonContrata ?? "",
            ocupacion: rese.ocupacionPaciente ?? "",
            cargoDesempenar: rese.cargoDe ?? "",

            // Tamizaje Dermatológico
            enfermedadPiel: rese.tieneEnfermedadPiel ?? false,
            enfermedadPielDetalle: rese.diagnosticoEnfermedad ?? "",
            algunaLesion: rese.tieneLesionActual ?? false,
            algunaLesionLocalizacion: rese.localizacionLesion ?? "",
            algunaLesionDesdeCuando: rese.tiempoLesion ?? "",
            coloracionPiel: rese.cambioColoracionPiel ?? false,
            variasLesiones: rese.lesionesRecurrentesAnuales ?? false,
            enrojecimiento: rese.tieneEnrojecimiento ?? false,
            enrojecimientoLocalizacion: rese.localizacionEnrojecimiento ?? "",
            comezon: rese.tieneComezon ?? false,
            comezonLocalizacion: rese.localizacionComezon ?? "",
            hinchazon: rese.tieneHinchazon ?? false,
            hinchazonLocalizacion: rese.localizacionHinchazon ?? "",
            alergiaAsma: rese.tieneRinitisOAsma ?? false,
            usaEpp: rese.usaEpp ?? true,
            usaEppProteccion: rese.tipoEpp ?? "",
            cambiosEnUnas: rese.cambiosEnUnas ?? false,
            algunaMedicacion: rese.tomaMedicacion ?? false,

            // Para el médico
            dermatopatia: rese.hallazgoSugerenteDermatopatia ?? false,
            necesitaDermatologo: rese.requiereEvaluacionDermatologica ?? false,
            interconsultaDermatologia: rese.requiereInterconsultaEspecialidad ?? false,

            // Comentarios
            comentarios: rese.comentarios ?? "",

            // Médico que Certifica
            user_doctorAsignado: rese.doctorAsignado ?? "",

            // Auditoría. TamizajeDermatologicoReporteDTO solo devuelve quién registró (`userRegistro`): no trae
            // fechas de registro/edición ni quién editó (la sección las muestra como "—"). Si el backend los
            // agrega, se leen solos.
            userRegistro: rese.userRegistro ?? rese.usuarioRegistro ?? "",
            fechaRegistro: rese.fechaRegistro ?? "",
            usuarioActualizacion: rese.usuarioActualizacion ?? "",
            fechaActualizacion: rese.fechaActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body =====
// TamizajeDermatologicoDTO usa `userRegistro` para el usuario que registra y NO declara fechas de registro /
// actualización, por eso no se sella auditoría (sellarAuditoria agregaría campos que el DTO no tiene). Al editar se
// reenvía el creador que devolvió el reporte (así no se pisa con quien edita); si no vino, el usuario en sesión.
const construirBody = (form, user, esActualizacion) => ({
    norden: form.norden,
    tieneEnfermedadPiel: form.enfermedadPiel ?? false,
    diagnosticoEnfermedad: form.enfermedadPielDetalle ?? "",
    tieneLesionActual: form.algunaLesion ?? false,
    localizacionLesion: form.algunaLesionLocalizacion ?? "",
    tiempoLesion: form.algunaLesionDesdeCuando ?? "",
    cambioColoracionPiel: form.coloracionPiel ?? false,
    lesionesRecurrentesAnuales: form.variasLesiones ?? false,
    tieneEnrojecimiento: form.enrojecimiento ?? false,
    localizacionEnrojecimiento: form.enrojecimientoLocalizacion ?? "",
    tieneComezon: form.comezon ?? false,
    localizacionComezon: form.comezonLocalizacion ?? "",
    tieneHinchazon: form.hinchazon ?? false,
    localizacionHinchazon: form.hinchazonLocalizacion ?? "",
    tieneRinitisOAsma: form.alergiaAsma ?? false,
    usaEpp: form.usaEpp ?? false,
    tipoEpp: form.usaEppProteccion ?? "",
    cambiosEnUnas: form.cambiosEnUnas ?? false,
    tomaMedicacion: form.algunaMedicacion ?? false,
    comentarios: form.comentarios ?? "",
    hallazgoSugerenteDermatopatia: form.dermatopatia ?? false,
    requiereEvaluacionDermatologica: form.necesitaDermatologo ?? false,
    requiereInterconsultaEspecialidad: form.interconsultaDermatologia ?? false,
    especialidad: "",
    fechaExamen: form.fecha,
    userRegistro: esActualizacion ? (form.userRegistro || user) : user,
    doctorAsignado: form.user_doctorAsignado,
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

// No se usa `imprimirReporteJasper`: este reporte llega envuelto en `resultado` y ese util valida `norden` en la raíz.
export const PrintHojaR = (nro, token, tabla) => {
    Loading("Cargando Formato a Imprimir");
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
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
            // Ejecuta la función exportada por default con los datos
            if (typeof modulo.default === "function") {
                modulo.default(datos);
                Swal.close();
            } else {
                console.error("El reporte de Tamizaje Dermatológico no exporta una función por defecto");
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

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente.
export const VerifyTR = async (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        // NO tiene registro
        onNuevo: () => GetInfoPac(nro, set, token, sede),
        // SÍ tiene registro
        onExistente: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Tamizaje Dermatológico.",
                    "warning"
                );
            }),
    });

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);

    // Norden inexistente / paciente no encontrado / error del backend.
    if (!res || res.error || !res.nombresApellidos) {
        Swal.fire({
            icon: "warning",
            title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
            html: `No se encontró ningún registro con el N° Orden ${nro}.`,
        });
        return;
    }

    set((prev) => ({
        ...prev,
        ...res,
        nombres: res.nombresApellidos ?? "",
        fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
        edad: res.edad ?? "",
        ocupacion: res.areaO ?? "",
        nombreExamen: res.nomExam ?? "",
        cargoDesempenar: res.cargo ?? "",
        lugarNacimiento: res.lugarNacimiento ?? "",
        sexo: convertirGenero(res.genero),
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
        tieneRegistro: false,
    }));
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
