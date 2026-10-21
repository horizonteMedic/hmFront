import Swal from "sweetalert2";
import {
    LABORATORIO_ASISTENCIAL_URL,
    actualizarRegistroTicket,
    auditoriaFromRegistro,
    confirmarImpresionTicket,
    formFromTicket,
    guardarRegistroTicket,
    imprimirReporteTicket,
    verificarRegistroTicket,
} from "../../../../../../utils/registroAsistencialUtils";

// Endpoint base asumido (ver el contrato en utils/registroAsistencialUtils).
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/panel-5d`;

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso
// se declara aquí (en el controller). En ocupacional el backend elige entre esta plantilla y la
// variante "ohla" según la empresa; en asistencial no hay empresa, se usa la estándar.
const jasperModules = import.meta.glob("../../../../../../jaspers/Toxicologia/*.jsx");
const rutaJasper = "../../../../../../jaspers/Toxicologia/ResultadosPanel5d_Digitalizado.jsx";

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
    set((prev) => ({
        ...prev,
        ...formFromTicket(paciente),
        numeroTicket: String(numeroTicket),
        fecha: registro.fechaExamen,

        valueM: registro.txtrMarihuana ?? "NEGATIVO",
        valueC: registro.txtrCocaina ?? "NEGATIVO",
        valueAn: registro.txtrAnfetamina ?? "NEGATIVO",
        valueMet: registro.txtrMethanfetamina ?? "NEGATIVO",
        valueBen: registro.txtrBenzodiacepina ?? "NEGATIVO",

        user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
        user_doctorAsignado: registro.doctorAsignado ?? "",

        // El bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: String(numeroTicket),

        ...auditoriaFromRegistro(registro),
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body =====
// La auditoría (usuario/fecha de registro y actualización) la resuelve el backend con `?usuario=`.
const construirBody = (form) => ({
    numeroTicket: Number(form.numeroTicket),
    pacienteId: form.pacienteId ?? null,
    fechaExamen: form.fecha,
    txtrCocaina: form.valueC,
    txtrMarihuana: form.valueM,
    txtrAnfetamina: form.valueAn,
    txtrMethanfetamina: form.valueMet,
    txtrBenzodiacepina: form.valueBen,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// ===== Impresión =====
// Reutiliza la plantilla Jasper de Panel 5D (ocupacional): imprime el N° de Ticket como "Nro de ficha".
export const PrintHojaR = (numeroTicket, token) =>
    imprimirReporteTicket({ numeroTicket, token, url: registrarUrl, jasperModules, rutaJasper });

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
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Panel 5D registrado correctamente.",
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
        limpiar,
        buildBody: construirBody,
        mensajeExito: "Panel 5D actualizado correctamente.",
        onPrint: () => PrintHojaR(numeroTicket, token),
    });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (numeroTicket, token, set) =>
    verificarRegistroTicket({
        numeroTicket,
        token,
        url: registrarUrl,
        onNuevo: (paciente) => GetInfoServicio(paciente, set, numeroTicket),
        onExistente: (paciente, registro) => {
            GetInfoServicioEditar(paciente, registro, set, numeroTicket);
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                html: "Este paciente ya cuenta con registros de Panel 5D.",
            });
        },
    });
