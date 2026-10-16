import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, escaparHtml, inventarioUrl, limpiarTexto } from "../inventarioUtils";

const retirosUrl = `${inventarioUrl}/retiros`;

// Con este motivo el backend exige explicar qué pasó en la observación.
export const MOTIVO_OTRO = "OTRO";

// Motivos de retiro que define el backend (vencimiento, pérdida, otro...).
export const ObtenerMotivosRetiro = (token) =>
    consultarInventario(`${retirosUrl}/motivos`, token, "No se pudieron cargar los motivos de retiro.");

// Retiros del inventario en un rango de fechas (las fechas son opcionales).
export const ObtenerRetiros = ({ inventarioId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${retirosUrl}?${query}`, token, "No se pudo cargar el historial de retiros.");
};

// { campo: mensaje } solo con lo que falta o es inválido. `lote` es el lote elegido (para avisar antes de
// enviar si se pide más de lo que tiene).
export const ValidarRetiro = (form, lote) => {
    const errores = {};
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";
    else if (!form.loteId) errores.loteId = "Seleccione el lote";

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    } else if (lote && Number(cantidad) > lote.cantidadActual) {
        errores.cantidad = `El lote solo tiene ${lote.cantidadActual} unidades`;
    }

    if (!form.motivo) errores.motivo = "Seleccione el motivo del retiro";
    else if (form.motivo === MOTIVO_OTRO && !limpiarTexto(form.observacion)) {
        errores.observacion = "Explique el motivo en la observación";
    }

    return errores;
};

// Devuelve true si el retiro quedó registrado, para que la pantalla limpie el formulario y recargue.
export const RegistrarRetiro = async (form, lote, token, usuario) => {
    const body = {
        loteId: Number(form.loteId),
        cantidad: Number(form.cantidad),
        motivo: form.motivo,
        observacion: limpiarTexto(form.observacion) || null,
    };

    // Un retiro descuenta stock y no se puede deshacer desde aquí: se confirma antes.
    const { isConfirmed } = await Swal.fire({
        title: "Registrar retiro",
        text: `Se retirarán ${body.cantidad} unidades del lote ${lote.numeroLote || "sin número"} de "${form.medicamentoTexto}" por ${body.motivo}. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, retirar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const url = `${retirosUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Retiro");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar el retiro.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", "Retiro registrado correctamente.", "success");
    return true;
};

// Ejecuta a mano la tarea que retira los lotes vencidos de todos los inventarios (el backend la corre solo; esto
// sirve para no esperar a la siguiente ejecución). Devuelve true si se ejecutó, aunque no hubiera nada que retirar.
export const RetirarVencidos = async (token, usuario) => {
    const { isConfirmed } = await Swal.fire({
        title: "Retirar vencidos",
        text: "Se retirarán de todos los inventarios los lotes que ya vencieron y se liberarán sus reservas. ¿Desea continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, retirar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const url = `${retirosUrl}/vencidos?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Retirando Vencidos");
    const res = await enviarInventario(url, undefined, token, "Ocurrió un error al retirar los vencidos.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    const { lotesRetirados = 0, unidadesRetiradas = 0, unidadesReservadasLiberadas = 0 } = res.resultado ?? {};
    if (lotesRetirados === 0) {
        await Swal.fire("Sin vencidos", "No hay lotes vencidos para retirar.", "info");
        return true;
    }

    await Swal.fire({
        title: "Éxito",
        html: `<div style="text-align:left">
            Lotes retirados: <b>${escaparHtml(lotesRetirados)}</b><br>
            Unidades retiradas: <b>${escaparHtml(unidadesRetiradas)}</b><br>
            Unidades reservadas liberadas: <b>${escaparHtml(unidadesReservadasLiberadas)}</b>
        </div>`,
        icon: "success",
    });
    return true;
};
