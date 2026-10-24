import Swal from "sweetalert2";
import {
    LABORATORIO_ASISTENCIAL_URL,
    actualizarRegistroTicket,
    ajustarDatosReporte,
    auditoriaFromRegistro,
    confirmarImpresionTicket,
    crearLectorReporte,
    formFromTicket,
    guardarRegistroTicket,
    imprimirReporteTicket,
    verificarRegistroTicket,
} from "../../../../../../utils/registroAsistencialUtils";

// Endpoints REALES del backend (OpenAPI). El POST es el MISMO de Análisis Bioquímicos (Perfil Lipídico):
// con `esGlucosaBasal: true` el backend registra la glucosa basal (y, si el examen es completo, el perfil
// lipídico); el reporte tiene su propia ruta.
//   POST {registrarUrl}                                                                       registra / actualiza
//   GET  {registrarUrl}/obtenerReporteGlucosaBasal?numeroTicket=&nameService=                 registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/analisis-bioquimico`;

// "Tiene registro" = `codAb` (misma fila que Perfil Lipídico: el POST solo actualiza si se envía el
// `codAb`). El OpenAPI no dice qué responde el backend cuando no hay registro: un error (404...), un
// `resultado` vacío o un `codAb` nulo/0 cuentan como "sin registro".
const leerRegistro = crearLectorReporte({
    url: registrarUrl,
    ruta: "obtenerReporteGlucosaBasal",
    nameService: "analisis_bioquimicos_glucosa_basal",
    tieneRegistro: (data) => Boolean(data.codAb),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo, sin datos laborales). El glob debe ser un literal
// para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/AnalisisBioquimicos/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/AnalisisBioquimicos/GlucosaBasalAsistencial_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
    const dosDecimales = (valor) =>
        valor !== undefined && valor !== null && valor !== '' ? parseFloat(valor).toFixed(2) : '';

    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        fecha: registro.fecha ?? registro.fechaExamen ?? prev.fecha,
        codAb: registro.codAb ?? null,

        glucosaBasal: registro.glucBasal ?? "",
        colesterolTotal: registro.txtColesterol ?? "",
        ldl: dosDecimales(registro.txtLdlColesterol),
        hdl: dosDecimales(registro.txtHdlColesterol),
        vldl: dosDecimales(registro.txtVldlColesterol),
        trigliceridos: registro.txtTrigliseridos ?? "",

        examenDirecto: Boolean(registro.txtColesterol),

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body =====
// El backend resuelve al paciente por el ticket (no lleva `pacienteId`). `txtCreatinina` se omite
// (no es de este examen); el perfil lipídico solo trae valores si el examen es completo.
//
// La auditoría se envía como la declara el DTO: `userRegistro` al crear; al editar, `usuarioActualizacion`
// y el `userRegistro` original (si no se reenvía, el UPDATE lo deja en null). Las fechas las pone el
// backend. `txtReponsable` = usuario en sesión que envía el formulario.
const construirBody = (form, user, esActualizacion) => ({
    numeroTicket: Number(form.numeroTicket),
    codAb: form.codAb ? form.codAb : null,
    fechaAb: form.fecha,
    fechaExamen: form.fecha,
    txtReponsable: user,
    glucBasal: form.glucosaBasal,
    txtColesterol: form.colesterolTotal,
    txtLdlColesterol: form.ldl,
    txtHdlColesterol: form.hdl,
    txtVldlColesterol: form.vldl,
    txtTrigliseridos: form.trigliceridos,
    esGlucosaBasal: true,

    userMedicoOcup: "",
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,

    ...(esActualizacion
        ? { usuarioActualizacion: user, userRegistro: form.userRegistro || null }
        : { userRegistro: user }),
});

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre (apellidos primero), sede, historia clínica y
// sellos de firma.
export const PrintHojaR = (numeroTicket, token) =>
    imprimirReporteTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroReporte,
        jasperModules,
        rutaJasper,
        ajustarDatos: ajustarDatosReporte(numeroTicket, token),
    });

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (numeroTicket, token) =>
    confirmarImpresionTicket(numeroTicket, () => PrintHojaR(numeroTicket, token));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar) => {
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.numeroTicket;
    return guardarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Glucosa Basal registrada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar) => {
    const numeroTicket = form.numeroTicket;
    return actualizarRegistroTicket({
        form,
        token,
        user,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        usuarioEnQuery: false,
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Glucosa Basal actualizada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (numeroTicket, token, set) =>
    verificarRegistroTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroFormulario,
        onNuevo: (paciente) => GetInfoServicio(paciente, set, numeroTicket),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(paciente, registro, set, numeroTicket);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: "Este paciente ya cuenta con registros de Glucosa Basal.",
            });
        },
    });
