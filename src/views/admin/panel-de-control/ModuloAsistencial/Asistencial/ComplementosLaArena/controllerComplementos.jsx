import Swal from "sweetalert2";
import { MostrarOpcionesImpresion } from "../../../../../utils/functionUtils";
import { GuardarDescanso, ImprimirDescansoPorTicket, descansoVacio, hayDatosDescanso, validarDescanso } from "../DescansoMedico/controllerDescansoMedico";
import { GuardarInformeAccidente, ImprimirInformeAccidentePorTicket, hayInformeAccidente } from "../InformeAccidente/controllerInformeAccidente";
import {
    GuardarReceta,
    ImprimirRecetaPorTicket,
    RECETA_ESTADO_INICIAL,
    hayLineaSinAgregar,
    hayReceta,
    validarReceta,
} from "../Receta/controllerReceta";

// Complementos de La Arena de las Historias Clínicas del módulo (Adulto Mayor, Mujer y Varón Adulto): la Receta
// (reserva de medicamentos), el Descanso Médico y el Informe de Accidente. No tienen botón propio: se guardan junto
// con la Historia Clínica (su botón Guardar / Guardar Cambios) y recién entonces se pueden imprimir, desde el
// mensaje de éxito o desde el botón IMPRIMIR N° TICKET. La Receta solo reserva el stock (farmacia la entrega desde
// Inventario > Entrega por Ticket), pero también se imprime: la recibe el paciente.
//
// Cada Historia pasa a las funciones de impresión su `obtenerDatosHC(numeroTicket, token)`: devuelve los datos
// de la Historia GUARDADA con los nombres de campo del formulario (n_hcl, numeroHistoriaClinica, nombres, dni, edad,
// sexo, diagnostico, tratamiento, nombre_medico, ticket*, tieneRegistro) o null si el ticket no existe.

// El orden es el del mensaje de éxito. Solo los que traen `imprimir` tienen reporte.
const COMPLEMENTOS = {
    receta: {
        etiqueta: "Receta",
        guardado: "Receta registrada (medicamentos reservados).",
        imprimir: ImprimirRecetaPorTicket,
    },
    descanso: {
        etiqueta: "Descanso Médico",
        guardado: "Descanso médico registrado.",
        imprimir: ImprimirDescansoPorTicket,
    },
    accidente: {
        etiqueta: "Informe de Accidente",
        guardado: "Informe de accidente registrado.",
        imprimir: ImprimirInformeAccidentePorTicket,
    },
};

const IMPRIMIBLES = Object.keys(COMPLEMENTOS).filter((clave) => COMPLEMENTOS[clave].imprimir);

// Si el ticket es de La Arena. Lo define el ticket (esArena, se marca al registrarlo en Ticket Asistencial) y el
// backend lo entrega en la respuesta de la Historia Clínica; ningún formulario lo edita. `data` es esa respuesta
// (esArena de la Historia, o el de su infoTicket). Un ticket anterior a este campo no lo trae: cuenta como no.
export const esArenaDe = (data) => Boolean(data?.esArena ?? data?.infoTicket?.esArena);

// Qué complementos trae el formulario para guardar. Solo cuentan en un ticket de La Arena (si no, sus secciones
// están ocultas y lo que haya quedado escrito no se envía).
export const complementosPorGuardar = (form) => ({
    receta: Boolean(form.esArena) && hayReceta(form),
    descanso: Boolean(form.esArena) && hayDatosDescanso(form),
    accidente: Boolean(form.esArena) && hayInformeAccidente(form),
});

// Qué complementos ya tienen algo en el formulario (registrado en el ticket o escrito). Las secciones solo se ven
// tras pulsar «Generar», salvo estas: se muestran siempre para que nada escrito (p. ej. un medicamento sin agregar,
// que bloquearía el guardado) ni nada ya registrado quede oculto.
export const complementosConContenido = (form) => ({
    receta: Boolean(form.recetaEstado) || (form.recetaItems ?? []).length > 0 || hayLineaSinAgregar(form),
    descanso: Boolean(form.descansoRegistrado) || hayDatosDescanso(form),
    accidente: Boolean(form.accidenteRegistrado) || hayInformeAccidente(form),
});

// Qué complementos ya existen en el ticket (se cargaron al buscarlo). No se pueden quitar: el backend no los da de baja.
export const complementosRegistrados = (form) => ({
    receta: Boolean(form.recetaEstado),
    descanso: Boolean(form.descansoRegistrado),
    accidente: Boolean(form.accidenteRegistrado),
});

// Campos del formulario de cada complemento en blanco: lo que se restablece al quitar uno que todavía no se registró.
export const camposVaciosComplemento = {
    receta: () => ({ ...RECETA_ESTADO_INICIAL }),
    descanso: descansoVacio,
    accidente: () => ({ accidenteCircunstancias: "" }),
};

// Primer problema de los complementos (o null): un descanso a medio llenar, o un medicamento de la receta escrito
// pero sin agregar, se avisan antes de guardar nada.
export const validarComplementos = (form) => {
    if (!form.esArena) return null;
    if (complementosPorGuardar(form).descanso) {
        const errorDescanso = validarDescanso(form);
        if (errorDescanso) return errorDescanso;
    }
    return validarReceta(form);
};

// Guarda los complementos del formulario. Se llama ANTES de guardar la Historia Clínica: si alguno falla, la
// Historia no se guarda y se puede reintentar sin duplicar nada (la Historia sí agrega, p. ej., vacunas nuevas
// cada vez que se envía; los complementos se crean o editan por ticket). La receta va primero: es la que más
// puede ser rechazada por el backend (stock, medicamentos inactivos). Devuelve cuáles se guardaron
// ({ receta, descanso, accidente }) o null si alguno falló (el motivo ya se mostró).
export const GuardarComplementos = async (form, token, userlogued) => {
    const porGuardar = complementosPorGuardar(form);
    if (porGuardar.receta && !(await GuardarReceta(form, token, userlogued))) return null;
    if (porGuardar.descanso && !(await GuardarDescanso(form, token, userlogued))) return null;
    if (porGuardar.accidente && !(await GuardarInformeAccidente(form, token, userlogued))) return null;
    return porGuardar;
};

// Opciones de impresión: la Historia Clínica, el Resumen Asistencial (`imprimirResumen`, el extra de La Arena que
// aporta cada Historia) y los complementos indicados (un botón por cada uno).
const opcionesImpresion = (
    claves,
    { numeroTicket, token, datosFooter, obtenerDatosHC, imprimirHistoria, imprimirResumen }
) => [
    { etiqueta: "Imprimir Historia Clínica", accion: imprimirHistoria },
    ...(imprimirResumen ? [{ etiqueta: "Imprimir Resumen Asistencial", accion: imprimirResumen }] : []),
    ...claves.map((clave) => ({
        etiqueta: `Imprimir ${COMPLEMENTOS[clave].etiqueta}`,
        accion: () => COMPLEMENTOS[clave].imprimir(numeroTicket, token, datosFooter, obtenerDatosHC),
    })),
];

// Mensaje de éxito y opciones de impresión tras guardar. En un ticket de La Arena (`esArena`) siempre hay opciones:
// la Historia Clínica, el Resumen Asistencial y un botón por cada complemento que tiene reporte y se guardó ahora.
// Fuera de La Arena y sin complementos guardados `opciones` es null y el guardado conserva su "¿Desea imprimir?"
// de siempre.
export const armarResultadoGuardado = ({ mensaje, guardados, esArena, ...impresion }) => {
    const claves = Object.keys(COMPLEMENTOS).filter((clave) => guardados?.[clave]);
    if (!claves.length && !esArena) return { mensaje, opciones: null };

    const imprimibles = claves.filter((clave) => IMPRIMIBLES.includes(clave));
    return {
        mensaje: [mensaje, ...claves.map((clave) => COMPLEMENTOS[clave].guardado)].join("\n"),
        opciones: esArena || imprimibles.length ? opcionesImpresion(imprimibles, impresion) : null,
    };
};

// Botón IMPRIMIR N° TICKET en un ticket de La Arena: en lugar de la confirmación simple, el mensaje ofrece un
// botón por documento (Historia Clínica, Resumen Asistencial, Receta, Descanso Médico e Informe de Accidente) del
// ticket indicado. Cada complemento avisa si ese ticket todavía no lo tiene.
export const ConfirmarImpresionConComplementos = async ({ numeroTicket, ...impresion }) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
        return;
    }

    await MostrarOpcionesImpresion(
        `<b style="color:#5b6ef5;">N° Ticket: ${numeroTicket}</b>`,
        opcionesImpresion(IMPRIMIBLES, { numeroTicket, ...impresion }),
        { titulo: "¿Desea Imprimir Reporte?", icono: "question" }
    );
};
