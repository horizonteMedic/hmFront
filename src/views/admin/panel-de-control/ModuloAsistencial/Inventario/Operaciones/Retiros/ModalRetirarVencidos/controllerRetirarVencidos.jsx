import ExcelJS from "exceljs";
import Swal from "sweetalert2";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../../../utils/formatDateUtils";
import { agregarHoja, descargarLibro, nombreSeguro } from "../../../Compartido/excelInventario";
import { etiquetaMedicamento, hoyISO, normalizarTexto } from "../../../Compartido/inventarioUtils";
import { EnviarRetiroLote } from "../controllerRetiros";

const MS_POR_DIA = 86400000;

// Motivo de retiro que corresponde a "vencimiento" entre los que define el backend (se busca por texto porque el
// backend lo define y podría llamarse VENCIMIENTO, VENCIDO...). Devuelve undefined si no hay ninguno.
export const MotivoVencimiento = (motivos) => (motivos ?? []).find((motivo) => normalizarTexto(motivo).includes("venc"));

// Días que faltan para que se retire por vencimiento un lote que vence dentro de este número de días (o antes).
export const DIAS_PROXIMOS_POR_DEFECTO = 15;

// Días que faltan para que venza un lote, a partir de su fecha "yyyy-MM-dd": 0 si vence hoy y negativo si ya venció
// (-3 = venció hace 3 días). null si la fecha no se puede interpretar.
export const DiasParaVencimiento = (fechaVencimiento) => {
    const [anio, mes, dia] = String(fechaVencimiento ?? "").slice(0, 10).split("-").map(Number);
    if (!anio || !mes || !dia) return null;

    const [anioHoy, mesHoy, diaHoy] = hoyISO().split("-").map(Number);
    return Math.round((Date.UTC(anio, mes - 1, dia) - Date.UTC(anioHoy, mesHoy - 1, diaHoy)) / MS_POR_DIA);
};

const estaVencido = (lote) => lote.vencido || DiasParaVencimiento(lote.fechaVencimiento) < 0;

// Lotes que toca retirar: los vencidos y los que vencen dentro de `dias` días o antes (0 = solo los vencidos).
export const LotesARetirar = (lotes, dias) =>
    lotes.filter((lote) => {
        const faltan = DiasParaVencimiento(lote.fechaVencimiento);
        return lote.vencido || (faltan != null && faltan <= dias);
    });

// Pide confirmar antes de retirar: descuenta stock y no se puede deshacer desde aquí.
export const ConfirmarRetiroVencidos = async (lotes, inventario) => {
    const unidades = lotes.reduce((total, lote) => total + lote.cantidadActual, 0);
    const { isConfirmed } = await Swal.fire({
        title: "Retirar lotes vencidos o por vencer",
        text: `Se retirarán ${lotes.length} lote(s), ${unidades} unidades en total, del inventario "${inventario.nombre}". Esta acción descuenta el stock. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, retirar",
        confirmButtonColor: "#dc2626",
        cancelButtonText: "Cancelar",
    });
    return isConfirmed;
};

// Retira, uno por uno, todo lo que queda de cada lote elegido. Devuelve { retirados, fallidos }:
//   retirados  [{ lote, cantidad, fecha }]
//   fallidos   [{ lote, mensaje }]  con el motivo que dio el backend para no retirarlo.
// Un lote que falla no detiene a los demás, salvo que la sesión haya expirado o no haya conexión: seguir sería fallar
// lote por lote con el mismo error, así que los que faltan quedan como no procesados. `onProgreso(n)` avisa cuántos
// lotes ya se procesaron.
export const RetirarLotesVencidos = async ({ lotes, motivo, onProgreso }, token, usuario) => {
    const retirados = [];
    const fallidos = [];

    for (let i = 0; i < lotes.length; i++) {
        onProgreso(i);
        const lote = lotes[i];
        const observacion = `LOTE ${estaVencido(lote) ? "VENCIDO" : "POR VENCER"} EL ${formatearFechaCorta(lote.fechaVencimiento)}`;
        const res = await EnviarRetiroLote({ loteId: lote.id, cantidad: lote.cantidadActual, motivo, observacion }, token, usuario);

        if (res.ok) {
            retirados.push({ lote, cantidad: lote.cantidadActual, fecha: new Date() });
            continue;
        }

        fallidos.push({ lote, mensaje: res.mensaje });
        if (res.status === 401 || res.status == null) {
            lotes.slice(i + 1).forEach((pendiente) => fallidos.push({ lote: pendiente, mensaje: "No se procesó porque el retiro se interrumpió." }));
            break;
        }
    }

    onProgreso(lotes.length);
    return { retirados, fallidos };
};

// ── Excel ──────────────────────────────────────────────────────────────────────────────────────

const columnasLote = [
    { etiqueta: "N°", ancho: 6, valor: (_, i) => i + 1 },
    { etiqueta: "Medicamento", ancho: 38, valor: (lote) => lote.medicamentoNombre },
    { etiqueta: "Presentación", ancho: 18, valor: (lote) => lote.presentacion },
    { etiqueta: "N° Lote", ancho: 16, valor: (lote) => lote.numeroLote || "Sin lote" },
    { etiqueta: "Vencimiento", ancho: 14, valor: (lote) => formatearFechaCorta(lote.fechaVencimiento) },
];

// Lista de los lotes que se van a retirar (los que están marcados), para revisarla o archivarla antes de confirmar.
export const DescargarListaVencidos = async (lotes, inventario) => {
    const libro = new ExcelJS.Workbook();
    const columnas = [
        ...columnasLote,
        { etiqueta: "Días para vencimiento", ancho: 20, valor: (lote) => DiasParaVencimiento(lote.fechaVencimiento) },
        { etiqueta: "Stock actual", ancho: 13, valor: (lote) => lote.cantidadActual },
        { etiqueta: "Reservado", ancho: 12, valor: (lote) => lote.cantidadReservada },
        { etiqueta: "Disponible", ancho: 12, valor: (lote) => lote.cantidadDisponible },
    ];
    agregarHoja(libro, "POR RETIRAR", `LOTES VENCIDOS Y POR VENCER POR RETIRAR | ${inventario.nombre} | ${formatearFechaCorta(hoyISO())}`, columnas, lotes);

    await descargarLibro(libro, `Vencidos_por_retirar_${nombreSeguro(inventario.nombre)}_${hoyISO()}.xlsx`);
};

// Relación de lo que se retiró (con fecha y hora de cada retiro) y, si algún lote no se pudo retirar, una segunda hoja
// con el motivo.
export const DescargarRelacionRetirados = async ({ retirados, fallidos }, inventario, usuario) => {
    const libro = new ExcelJS.Workbook();
    const titulo = (texto) => `${texto} | ${inventario.nombre} | ${formatearFechaCorta(hoyISO())}`;

    agregarHoja(
        libro,
        "RETIRADOS",
        titulo("LOTES VENCIDOS Y POR VENCER RETIRADOS"),
        [
            ...columnasLote.map((columna) => ({ ...columna, valor: (retiro, i) => columna.valor(retiro.lote, i) })),
            { etiqueta: "Cantidad retirada", ancho: 16, valor: (retiro) => retiro.cantidad },
            { etiqueta: "Fecha y hora del retiro", ancho: 22, valor: (retiro) => formatearFechaHora(retiro.fecha) },
            { etiqueta: "Usuario", ancho: 16, valor: () => usuario },
        ],
        retirados
    );

    if (fallidos.length > 0) {
        agregarHoja(
            libro,
            "NO RETIRADOS",
            titulo("LOTES VENCIDOS Y POR VENCER QUE NO SE PUDIERON RETIRAR"),
            [
                ...columnasLote.map((columna) => ({ ...columna, valor: (fallo, i) => columna.valor(fallo.lote, i) })),
                { etiqueta: "Stock actual", ancho: 13, valor: (fallo) => fallo.lote.cantidadActual },
                { etiqueta: "Motivo", ancho: 50, valor: (fallo) => fallo.mensaje },
            ],
            fallidos
        );
    }

    await descargarLibro(libro, `Retiro_vencidos_${nombreSeguro(inventario.nombre)}_${hoyISO()}.xlsx`);
};

// Texto del medicamento de un lote, para las tablas de la pantalla.
export const MedicamentoDelLote = (lote) => etiquetaMedicamento({ nombre: lote.medicamentoNombre, presentacion: lote.presentacion });
