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

// Endpoints REALES del backend (OpenAPI). BK y KOH comparten el MISMO endpoint y la MISMA fila por ticket
// (Microbiología: `muestra1`, `muestra2` y `koh`); el modo "Examen Directo" de la vista solo decide qué
// campos se muestran y qué plantilla se imprime ("microbiologia" = BK, "koh" = KOH).
//   POST {registrarUrl}                                                         registra / actualiza
//   GET  {registrarUrl}/obtenerReporte?numeroTicket=&nameService=&esJasper=     registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/microbiologia`;

// El reporte no trae un id propio del registro, así que se considera que el ticket "tiene registro" cuando
// el reporte trae su auditoría de creación (fechaRegistro / userRegistro). El OpenAPI no dice qué responde
// el backend cuando no hay registro: un error (404...), un `resultado` vacío o sin auditoría cuentan como
// "sin registro".
const leerRegistro = crearLectorReporte({
    url: registrarUrl,
    nameService: "microbiologia_asistencial",
    tieneRegistro: (data) => Boolean(data.fechaRegistro || data.userRegistro),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo, sin datos laborales), uno por modo. El glob debe ser un
// literal para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/Inmunologia/*.jsx");
const carpetaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/Inmunologia";
const rutaJasperPor = (tabla) =>
    tabla === "koh"
        ? `${carpetaJasper}/Koh_Digitalizado.jsx`
        : `${carpetaJasper}/MicrobiologiaBk_Digitalizado.jsx`;

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
// Se cargan los TRES resultados sea cual sea el modo, porque se vuelven a enviar al guardar: así guardar
// el KOH no borra la baciloscopia del mismo ticket ni al revés.
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        fecha: registro.fechaExamen ?? prev.fecha,

        bk1: registro.muestra1 ?? "",
        bk2: registro.muestra2 ?? "",
        koh: registro.koh ?? "",

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
// declara el DTO: `userRegistro` al crear; al editar, `usuarioActualizacion` y el `userRegistro` original
// (si no se reenvía, el UPDATE lo deja en null). Las fechas las pone el backend.
const construirBody = (form, user, esActualizacion) => ({
    numeroTicket: Number(form.numeroTicket),
    muestra1: form.bk1,
    muestra2: form.bk2,
    koh: form.koh,
    fechaExamen: form.fecha,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,

    ...(esActualizacion
        ? { usuarioActualizacion: user, userRegistro: form.userRegistro || null }
        : { userRegistro: user }),
});

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre (apellidos primero), sede, historia clínica y
// sellos de firma.
export const PrintHojaR = (numeroTicket, token, tabla) =>
    imprimirReporteTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        obtenerRegistro: obtenerRegistroReporte,
        jasperModules,
        rutaJasper: rutaJasperPor(tabla),
        ajustarDatos: ajustarDatosReporte(numeroTicket, token),
    });

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (numeroTicket, token, tabla) =>
    confirmarImpresionTicket(numeroTicket, () => PrintHojaR(numeroTicket, token, tabla));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) => {
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
        mensajeExito: "Microbiología registrada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token, tabla),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) => {
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
        mensajeExito: "Microbiología actualizada correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token, tabla),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
// `tabla` ya no cambia de endpoint (BK y KOH son la misma fila); se conserva en la firma porque la vista la
// pasa.
export const VerifyTR = (numeroTicket, tabla, token, set) =>
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
                html: "Este paciente ya cuenta con registros de Microbiología.",
            });
        },
    });
