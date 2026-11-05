import Swal from "sweetalert2";
import {
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

const obtenerReporteUrl = "/api/v01/ct/riesgoCardiovascular/obtenerReporte";
const registrarUrl = "/api/v01/ct/riesgoCardiovascular/registrarActualizar";

// Reporte Jasper (un solo formato). El glob debe ser un literal para que Vite lo resuelva en build.
const jasperModules = import.meta.glob("../../../../jaspers/RiesgoCardiovascular/*.jsx");
const rutaReportes = "../../../../jaspers/RiesgoCardiovascular/";

const convertirNumero = (numero) => {
    return numero
        ? Math.round(parseFloat(numero)).toString()
        : "";
}

// Datos del reporte que alimentan el formulario (paciente, factores de riesgo y perfil lipídico). El reporte llega
// envuelto en `resultado` (si algún día llega plano, se lee igual). Son los mismos para un registro nuevo y uno existente.
const mapearReporte = (rese) => ({
    norden: rese.norden ?? "",
    id: rese.id ?? null,
    nombreExamen: rese.tipoExamen ?? "",
    dni: rese.dniPaciente ?? "",

    nombres: `${rese.nombresPaciente ?? ""} ${rese.apellidosPaciente ?? ""}`.trim(),
    fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
    lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
    edad: rese.edadPaciente ?? "",
    sexo: convertirGenero(rese.sexoPaciente),
    estadoCivil: rese.estadoCivilPaciente ?? "",
    nivelEstudios: rese.nivelEstudioPaciente ?? "",
    // Datos Laborales
    empresa: rese.empresa ?? "",
    contrata: rese.contrata ?? "",
    ocupacion: rese.areaPaciente ?? "",
    cargoDesempenar: rese.cargoPaciente ?? "",

    diabetes: rese.diabetes ?? false,
    // RiesgoCardiovascularReporteDTO trae `fumar` (no `fuma`): antes siempre quedaba en "No" y el cálculo del riesgo
    // no sumaba los puntos del fumador.
    fuma: rese.fumar ?? rese.fuma ?? false,

    tensionSistolica: convertirNumero(rese.sistolica),

    tensionDiastolica: convertirNumero(rese.diastolica),

    colesterolTotal: convertirNumero(rese.colesterol),

    colesterolHdl: convertirNumero(rese.hdlColesterol),

    trigliceridos: convertirNumero(rese.trigliseridos),

    colesterolLdl: convertirNumero(rese.ldlColesterol),
});

const auditoriaVacia = {
    userRegistro: "",
    fechaRegistro: "",
    usuarioActualizacion: "",
    fechaActualizacion: "",
};

// ===== Registro nuevo =====
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
    if (res) {
        const rese = res.resultado ?? res;
        set((prev) => ({
            ...prev,
            ...mapearReporte(rese),
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
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        const rese = res.resultado ?? res;
        set((prev) => ({
            ...prev,
            ...mapearReporte(rese),
            fecha: rese.fecha ?? prev.fecha,

            user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma,

            // Auditoría. RiesgoCardiovascularReporteDTO no devuelve quién registró ni fechas de registro/edición:
            // quedan vacías (la sección las muestra como "—"). Si el backend las agrega, se leen solas.
            userRegistro: rese.usuarioRegistro ?? rese.userRegistro ?? "",
            fechaRegistro: rese.fechaRegistro ?? "",
            usuarioActualizacion: rese.usuarioActualizacion ?? "",
            fechaActualizacion: rese.fechaActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body =====
// RiesgoCardiovascularDTO usa `usuarioRegistro` (antes se mandaba `userRegistro`, que el DTO no tiene: el backend
// lo ignoraba y no se guardaba quién registró) y NO declara fechas de registro / actualización, por eso no se sella
// auditoría. El reporte (GET) tampoco devuelve el creador: se manda el usuario en sesión.
const construirBody = (form, user, esActualizacion) => ({
    norden: form.norden,
    fecha: form.fecha,
    id: form.id,
    riesgoCoronario: form.riesgoEventoCoronario10,
    riesgoIdeal: form.riesgoIdealEventoCoronario10,
    riesgoPromedio: form.riesgoPromedioEventoCoronario10,
    riesgoPromedioSevero: form.riesgoPromedioEventoCoronarioSevero10,

    usuarioRegistro: esActualizacion ? (form.userRegistro || user) : user,
    usuarioFirma: form.user_medicoFirma,
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
            // El backend indica el formato en `nameJasper`; hoy hay uno solo.
            const nombre = datos.nameJasper || datos.namejasper || "RiesgoCardiovascular";
            const cargarModulo = jasperModules[`${rutaReportes}${nombre}.jsx`];
            if (!cargarModulo) {
                console.error(`No existe el formato ${nombre}.jsx del reporte de Riesgo Cardiovascular`);
                Swal.fire({
                    icon: "error",
                    title: '<i class="fa-solid fa-print"></i>Error',
                    html: "No se pudo cargar el formato de impresión.",
                });
                return;
            }
            const modulo = await cargarModulo();
            // Ejecuta la función exportada por default con los datos
            if (typeof modulo.default === "function") {
                modulo.default(datos);
                Swal.close();
            } else {
                console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
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

// verificarRegistro valida la sede del N° Orden y decide nuevo / existente / necesita exámenes previos.
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
                    "Este paciente ya cuenta con registros de Riesgo Cardiovascular.",
                    "warning"
                );
            }),
        // Necesita sus exámenes previos antes de registrar.
        onNecesitaExamen: () =>
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Antecedentes Patológicos, Perfil Lipídico y Triaje.",
                "warning"
            ),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
