import Swal from "sweetalert2";
import { MostrarOpcionesImpresion } from "../../../../../utils/functionUtils";
import { GuardarDescanso, ImprimirDescansoPorTicket, hayDatosDescanso, validarDescanso } from "../DescansoMedico/controllerDescansoMedico";
import { GuardarInformeAccidente, ImprimirInformeAccidentePorTicket, hayInformeAccidente } from "../InformeAccidente/controllerInformeAccidente";

// Complementos de La Arena de las Historias Clínicas del módulo (Adulto Mayor, Mujer y Varón Adulto): el
// Descanso Médico y el Informe de Accidente. No tienen botón propio: se guardan junto con la Historia
// Clínica (su botón Guardar / Guardar Cambios) y recién entonces se pueden imprimir, desde el mensaje de
// éxito o desde el botón IMPRIMIR N° TICKET.
//
// Cada Historia pasa a las funciones de impresión su `obtenerDatosHC(numeroTicket, token)`: devuelve los datos
// de la Historia GUARDADA con los nombres de campo del formulario (n_hcl, numeroHistoriaClinica, nombres, dni,
// diagnostico, tratamiento, nombre_medico, ticket*, tieneRegistro) o null si el ticket no existe.

const COMPLEMENTOS = {
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

// Qué complementos trae el formulario para guardar. Solo cuentan con "La Arena" marcado (si no, sus secciones
// están ocultas y lo que haya quedado escrito no se envía).
export const complementosPorGuardar = (form) => ({
    descanso: Boolean(form.laArena) && hayDatosDescanso(form),
    accidente: Boolean(form.laArena) && hayInformeAccidente(form),
});

// Primer problema de los complementos (o null): un descanso a medio llenar se avisa antes de guardar nada.
export const validarComplementos = (form) => (complementosPorGuardar(form).descanso ? validarDescanso(form) : null);

// Guarda los complementos del formulario. Se llama ANTES de guardar la Historia Clínica: si alguno falla, la
// Historia no se guarda y se puede reintentar sin duplicar nada (la Historia sí agrega, p. ej., vacunas nuevas
// cada vez que se envía; los complementos se crean o editan por ticket). Devuelve cuáles se guardaron
// ({ descanso, accidente }) o null si alguno falló (el motivo ya se mostró).
export const GuardarComplementos = async (form, token, userlogued) => {
    const porGuardar = complementosPorGuardar(form);
    if (porGuardar.descanso && !(await GuardarDescanso(form, token, userlogued))) return null;
    if (porGuardar.accidente && !(await GuardarInformeAccidente(form, token, userlogued))) return null;
    return porGuardar;
};

// Opciones de impresión: la Historia Clínica y los complementos indicados (un botón por cada uno).
const opcionesImpresion = (claves, { numeroTicket, token, datosFooter, obtenerDatosHC, imprimirHistoria }) => [
    { etiqueta: "Imprimir Historia Clínica", accion: imprimirHistoria },
    ...claves.map((clave) => ({
        etiqueta: `Imprimir ${COMPLEMENTOS[clave].etiqueta}`,
        accion: () => COMPLEMENTOS[clave].imprimir(numeroTicket, token, datosFooter, obtenerDatosHC),
    })),
];

// Mensaje de éxito y opciones de impresión tras guardar. Sin complementos guardados `opciones` es null y el
// guardado conserva su "¿Desea imprimir?" de siempre; con ellos, un botón por cada documento guardado.
export const armarResultadoGuardado = ({ mensaje, guardados, ...impresion }) => {
    const claves = Object.keys(COMPLEMENTOS).filter((clave) => guardados?.[clave]);
    if (!claves.length) return { mensaje, opciones: null };

    return {
        mensaje: [mensaje, ...claves.map((clave) => COMPLEMENTOS[clave].guardado)].join("\n"),
        opciones: opcionesImpresion(claves, impresion),
    };
};

// Botón IMPRIMIR N° TICKET con "La Arena" marcado: en lugar de la confirmación simple, el mensaje ofrece un
// botón por documento (Historia Clínica, Descanso Médico e Informe de Accidente) del ticket indicado. Cada
// complemento avisa si ese ticket todavía no lo tiene.
export const ConfirmarImpresionConComplementos = async ({ numeroTicket, ...impresion }) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
        return;
    }

    await MostrarOpcionesImpresion(
        `<b style="color:#5b6ef5;">N° Ticket: ${numeroTicket}</b>`,
        opcionesImpresion(Object.keys(COMPLEMENTOS), { numeroTicket, ...impresion }),
        { titulo: "¿Desea Imprimir Reporte?", icono: "question" }
    );
};
