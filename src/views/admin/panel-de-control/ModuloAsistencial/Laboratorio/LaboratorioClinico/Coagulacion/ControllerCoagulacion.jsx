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
} from "../../../../../../utils/registroAsistencialUtils.js";

// Endpoints REALES del backend (OpenAPI):
//   POST {registrarUrl}                                                         registra / actualiza
//   GET  {registrarUrl}/obtenerReporte?numeroTicket=&nameService=&esJasper=     registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/tiempo-coagulacion-sangria`;

// El reporte de Coagulación no trae un id propio del registro, así que se considera que el ticket
// "tiene registro" cuando el reporte trae su auditoría de creación (fechaRegistro / userRegistro). El
// OpenAPI no dice qué responde el backend cuando no hay registro: un error (404...), un `resultado`
// vacío o sin auditoría cuentan como "sin registro".
const leerRegistro = crearLectorReporte({
    url: registrarUrl,
    nameService: "tiempo_coagulacion_sangria_asistencial",
    tieneRegistro: (data) => Boolean(data.fechaRegistro || data.userRegistro),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo, sin datos laborales). El glob debe ser un literal
// para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/Coagulacion_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        fecha: registro.fechaExamen ?? prev.fecha,

        // Pruebas
        coagulacion: registro.tiempoCoagulacionResultado ?? "",
        sangria: registro.tiempoSangriaResultado ?? "",

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body =====
// El backend resuelve al paciente por el ticket (no lleva `pacienteId`). La auditoría se envía como la
// declara el DTO: `userRegistro` al crear; al editar, `usuarioActualizacion` y el `userRegistro`
// original (si no se reenvía, el UPDATE lo deja en null). Las fechas las pone el backend.
const construirBody = (form, user, esActualizacion) => ({
    numeroTicket: Number(form.numeroTicket),
    fechaExamen: form.fecha,
    tiempoCoagulacionResultado: form.coagulacion,
    tiempoSangriaResultado: form.sangria,
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
        mensajeExito: "Tiempo de Coagulación y Sangría registrado correctamente.",
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
        mensajeExito: "Tiempo de Coagulación y Sangría actualizado correctamente.",
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
        onNuevo: (paciente) => GetInfoServicio(paciente, set),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(paciente, registro, set, numeroTicket);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: "Este paciente ya cuenta con registros de Tiempo de Coagulación y Sangría.",
            });
        },
    });
