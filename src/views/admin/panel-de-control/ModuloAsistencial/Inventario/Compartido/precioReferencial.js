import { consultarInventario, inventarioUrl } from "./inventarioUtils";

// El precio referencial se guarda por lote al ingresar el stock (en soles) y se usa para dar un valor aproximado al
// stock, a los retiros, a las entregas y a los reportes. Es una referencia, no un costo contable. Los lotes que se
// ingresaron antes de existir el campo no tienen precio: sus valores salen como "—" y no entran en los totales.
const MONEDA = "S/";
const formatoMonto = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Más de esto es casi seguro un error de digitación (un cero de más).
export const PRECIO_MAXIMO = 1000000;

// El precio y las cantidades son números con a lo sumo 2 decimales: se redondea para no arrastrar 0.30000000000000004.
const redondear = (numero) => Math.round(numero * 100) / 100;

// "S/ 1,234.50", o "—" si no hay monto.
export const formatearMonto = (valor) => {
    if (valor == null || valor === "") return "—";
    const numero = Number(valor);
    return Number.isFinite(numero) ? `${MONEDA} ${formatoMonto.format(numero)}` : "—";
};

// Formato de Excel para los montos en soles.
export const FORMATO_MONTO_EXCEL = "#,##0.00";

// Monto para una celda de Excel: el número (así Excel lo puede sumar y darle formato) o "—" si no se pudo calcular.
export const montoExcel = (valor) => (valor == null ? "—" : valor);

// Precio referencial de un lote, o null si el lote no lo tiene.
export const precioDeLote = (lote) => {
    const precio = lote?.precioReferencial;
    if (precio == null || precio === "") return null;
    const numero = Number(precio);
    return Number.isFinite(numero) && numero >= 0 ? numero : null;
};

// Valor de `cantidad` unidades del lote (por defecto, todo lo que tiene), o null si no se puede calcular.
export const valorDeLote = (lote, cantidad = lote?.cantidadActual) => {
    if (cantidad == null || cantidad === "") return null;
    const unidades = Number(cantidad);
    if (!Number.isFinite(unidades)) return null;
    // Sin unidades no hay nada que valorizar, tenga el lote precio o no.
    if (unidades === 0) return 0;
    const precio = precioDeLote(lote);
    return precio == null ? null : redondear(precio * unidades);
};

// Suma una lista de valores (número o null). `sinPrecio` cuenta los que no se pudieron valorizar.
export const sumarValores = (valores) => {
    let total = 0;
    let sinPrecio = 0;
    valores.forEach((valor) => {
        if (valor == null) sinPrecio++;
        else total += valor;
    });
    return { total: redondear(total), sinPrecio };
};

// "S/ 1,234.50" y, si hay filas que no se pudieron valorizar, "(2 sin precio)": un total parcial no debe parecer completo.
export const textoValorTotal = ({ total, sinPrecio }) => `${formatearMonto(total)}${sinPrecio > 0 ? ` (${sinPrecio} sin precio)` : ""}`;

// Lotes por id (como texto), para buscar el precio de lo que un movimiento menciona por `loteId`.
export const indexarLotes = (lotes) => new Map((lotes ?? []).map((lote) => [String(lote.id), lote]));

// Valor de un movimiento de un solo lote ({ loteId, cantidad }), o null si el lote no se encontró o no tiene precio.
export const valorDeMovimiento = (movimiento, lotesPorId) => valorDeLote(lotesPorId.get(String(movimiento?.loteId)), movimiento?.cantidad);

// Valor de un movimiento repartido en varios lotes ([{ loteId, cantidad }], como las entregas y las recetas). Si a alguno
// de los lotes le falta el precio devuelve null: un valor parcial parecería completo.
export const valorDeMovimientoPorLotes = (partes, lotesPorId) => {
    if (!partes || partes.length === 0) return null;
    const valores = partes.map((parte) => valorDeMovimiento(parte, lotesPorId));
    return valores.some((valor) => valor == null) ? null : redondear(valores.reduce((suma, valor) => suma + valor, 0));
};

// Valor en stock de cada medicamento a partir de los lotes del inventario: Map(medicamentoId como texto ->
// { total, sinPrecio, lotes }). Solo cuentan los lotes con unidades; `sinPrecio` son los que no tienen precio, así que un
// total con `sinPrecio` > 0 es parcial y uno con `sinPrecio` === `lotes` no tiene ningún precio.
export const valorPorMedicamento = (lotes) => {
    const porMedicamento = new Map();
    (lotes ?? []).forEach((lote) => {
        if (!(Number(lote.cantidadActual) > 0)) return;
        const clave = String(lote.medicamentoId);
        const acumulado = porMedicamento.get(clave) ?? { valores: [] };
        acumulado.valores.push(valorDeLote(lote));
        porMedicamento.set(clave, acumulado);
    });
    return new Map([...porMedicamento].map(([clave, { valores }]) => [clave, { ...sumarValores(valores), lotes: valores.length }]));
};

// Valor de un medicamento ({ total, sinPrecio, lotes } de `valorPorMedicamento`) para mostrar: "S/ 50.00", "S/ 50.00*" si es
// parcial o "—" si ningún lote tiene precio.
export const textoValorMedicamento = (valor) => {
    if (!valor || valor.sinPrecio >= valor.lotes) return "—";
    return `${formatearMonto(valor.total)}${valor.sinPrecio > 0 ? "*" : ""}`;
};

// Texto de un precio escrito por el usuario ("12", "12.5", "12,50") -> número, o null si no es un monto válido: solo
// dígitos, con hasta 2 decimales, entre 0 y PRECIO_MAXIMO.
export const parsearPrecio = (valor) => {
    const texto = String(valor ?? "").trim().replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(texto)) return null;
    const numero = Number(texto);
    return numero <= PRECIO_MAXIMO ? numero : null;
};

// Precio mientras se escribe en una celda: dígitos con un punto y hasta 2 decimales. Lo que no cumple se descarta y se
// queda el texto anterior.
export const soloPrecio = (nuevo, anterior) => (/^\d*(\.\d{0,2})?$/.test(nuevo) ? nuevo : anterior ?? "");

// Mensaje del problema de un precio escrito por el usuario, o "" si es válido.
export const errorPrecio = (valor) => {
    const texto = String(valor ?? "").trim();
    if (!texto) return "Ingrese el precio referencial";
    if (parsearPrecio(texto) == null) return `Ingrese un monto de 0 a ${PRECIO_MAXIMO.toLocaleString("en-US")}, con hasta 2 decimales`;
    return "";
};

// Todos los lotes del inventario, vencidos incluidos y de cualquier medicamento (con su precio referencial), para
// calcular el valor de lo que los movimientos mencionan por `loteId`.
export const ObtenerLotesInventario = (inventarioId, token) =>
    consultarInventario(
        `${inventarioUrl}/stock/lotes?${new URLSearchParams({ inventarioId, incluirVencidos: true })}`,
        token,
        "No se pudieron cargar los precios de los lotes del inventario."
    );
