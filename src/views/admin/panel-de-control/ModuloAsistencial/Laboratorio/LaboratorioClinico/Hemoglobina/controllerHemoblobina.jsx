import Swal from "sweetalert2";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
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

// Endpoints REALES del backend (OpenAPI). El POST es el MISMO de Laboratorio Clínico: con
// `esHemoglobina: true` el backend solo actualiza los campos de Hemoglobina; el reporte tiene su
// propia ruta.
//   POST {registrarUrl}                                                                   registra / actualiza
//   GET  {registrarUrl}/obtenerReporteHemoglobina?numeroTicket=&nameService=&esJasper=    registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/clinico`;

// Misma fila (codLabclinico) que Laboratorio Clínico: si el ticket ya tiene ese registro, aquí se carga
// como existente. El OpenAPI no dice qué responde el backend cuando no hay registro: un error (404...),
// un `resultado` vacío o un `codLabclinico` nulo/0 cuentan como "sin registro".
const leerRegistro = crearLectorReporte({
    url: registrarUrl,
    ruta: "obtenerReporteHemoglobina",
    nameService: "lab_clinico_asistencial",
    tieneRegistro: (data) => Boolean(data.codLabclinico),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo, sin datos de empresa). El glob debe ser un literal
// para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/Hemoglobina_Digitalizado.jsx";

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
        fecha: registro.fechaLab ?? prev.fecha,

        codLabclinico: registro.codLabclinico ?? "",

        grupoSanguineo: registro.chko ? "O" :
            registro.chka ? "A" :
                registro.chkb ? "B" :
                    registro.chkab ? "AB" : "",
        factorRh: registro.rbrhpositivo ? "RH(+)" : registro.rbrhnegativo ? "RH(-)" : "",
        hematocrito: registro.hematocrito ?? "",
        hemoglobina: registro.hemoglobina ?? "",

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
// Solo los campos de este formulario (el DTO del POST es el de Laboratorio Clínico, con muchos más):
// el resto se omite y, con `esHemoglobina`, el backend tampoco los actualiza. El backend resuelve al
// paciente por el ticket (no lleva `pacienteId`).
const construirBase = (form) => ({
    numeroTicket: Number(form.numeroTicket),
    codLabclinico: form.codLabclinico ? form.codLabclinico : null,
    tipoServicio: "",
    fechaLab: form.fecha,
    chko: form.grupoSanguineo == "O",
    chka: form.grupoSanguineo == "A",
    chkb: form.grupoSanguineo == "B",
    chkab: form.grupoSanguineo == "AB",
    rbrhpositivo: form.factorRh == "RH(+)",
    rbrhnegativo: form.factorRh == "RH(-)",
    txtHemoglobina: form.hemoglobina,
    txtHematocrito: form.hematocrito,

    esHemoglobina: true,

    userMedicoOcup: "",

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo. El POST no recibe `?usuario=`: la auditoría viaja en el body (userRegistro /
// usuarioActualizacion), igual que en el ocupacional.
//
// OJO: en el ocupacional de Hemoglobina el backend usa la clave "fechaRegistro" del body para la FECHA
// DEL EXAMEN (igual que "fechaLab"), no para la auditoría de creación; por eso, tras sellar la
// auditoría se vuelve a forzar "fechaRegistro" a `form.fecha` (contrato ya probado). Si el POST
// asistencial la ignora, no cambia nada.
const construirBody = (form, user, esActualizacion) => ({
    ...sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    }),
    fechaRegistro: form.fecha,
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
        mensajeExito: "Hemoglobina registrada correctamente.",
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
        mensajeExito: "Hemoglobina actualizada correctamente.",
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
                html: "Este paciente ya cuenta con registros de Hemoglobina.",
            });
        },
    });
