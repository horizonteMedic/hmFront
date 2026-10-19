import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faUpload } from "@fortawesome/free-solid-svg-icons";
import CampaniaActivaBanner from "../../../components/CampaniaActivaBanner";
import ModalBase from "../../../components/ModalBase";
import { mensajeDeError } from "../../../utils/apiSalud";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { FloatingInput } from "../components/FloatingField";
import {
    aplicarEdicionInventario,
    descargarHojaInventario,
    exportarResultadosInventario,
    leerExcelInventario,
} from "./ControllerEdicionInventario";
import { ESTADO_FILA } from "./estadosFila";
import ResumenCarga, { FallosSinFila } from "./ResumenCarga";

const ESTADO = { ...ESTADO_FILA, success: { ...ESTADO_FILA.success, etiqueta: "✔ Aplicado" } };

const ENCABEZADOS = ["Estado", "ID", "Nombre", "Presentación", "Uso", "Precio unit.", "Stock", "Qué se hará"];

// Stock de la fila: el actual y, si se ajusta, cómo quedará; en un medicamento nuevo, su stock inicial.
const textoStock = (fila) => {
    if (fila.tipo === "nuevo") return fila.estado === "invalida" ? "" : `→ ${fila.unidades}`;
    return fila.diferencia ? `${fila.stockActual} → ${fila.stockActual + fila.diferencia}` : fila.stockActual;
};

const plural = (n, singular, pluralTexto) => `${n} ${n === 1 ? singular : pluralTexto}`;

// Edición masiva del inventario de la campaña con un Excel: se descarga con los medicamentos actuales, se
// cambian sus datos o se aumenta/disminuye su stock (de forma explícita) y se pueden agregar medicamentos nuevos.
export default function EdicionInventario({ token, usuario, campania, existentes, onClose, onVolver, onCargado }) {
    const [filas, setFilas] = useState([]);
    const [sinFila, setSinFila] = useState([]); // fallos de medicamentos nuevos que no se pudieron asociar a una fila
    const [motivo, setMotivo] = useState("");
    const [procesando, setProcesando] = useState(false);
    const [procesado, setProcesado] = useState(false);
    const selectorArchivo = useRef(null);

    const cuenta = (...estados) => filas.filter((f) => estados.includes(f.estado)).length;
    const listos = filas.filter((f) => f.estado === "pendiente");
    const nuevos = listos.filter((f) => f.tipo === "nuevo").length;
    const ediciones = listos.filter((f) => f.datos.length).length;
    const ajustes = listos.filter((f) => f.diferencia).length;
    const hayAjustes = filas.some((f) => f.diferencia);

    // Por qué no se pueden aplicar los cambios todavía y qué hay que corregir ("" si se puede o aún no hay archivo)
    const invalidas = cuenta("invalida");
    const motivoBloqueo = (() => {
        if (!filas.length || procesando || procesado) return "";
        if (!listos.length && invalidas) {
            const filasInvalidas = invalidas === 1 ? "la fila marcada" : `las ${invalidas} filas marcadas`;
            return `No hay ningún cambio válido para aplicar. Corrige ${filasInvalidas} como «Inválida» (el motivo está en la columna «Qué se hará»), guarda el Excel y vuelve a subirlo.`;
        }
        if (!listos.length) {
            return "El archivo no tiene cambios que aplicar: ninguna fila modifica datos ni stock. Edita el Excel (los datos, o AJUSTE DE STOCK y CANTIDAD) y vuelve a subirlo.";
        }
        if (ajustes && !motivo.trim()) {
            return "Falta el motivo de los ajustes de stock: escríbelo en el campo «Motivo de los ajustes de stock» para poder aplicar los cambios.";
        }
        return "";
    })();
    const puedeProcesar = filas.length > 0 && !procesando && !procesado && !motivoBloqueo;
    console.log(puedeProcesar)
    const handleArchivo = async (e) => {
        const archivo = e.target.files[0];
        e.target.value = "";
        if (!archivo) return;

        try {
            setFilas(await leerExcelInventario(archivo, existentes));
            setSinFila([]);
            setProcesado(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo leer el archivo. Verifica que sea el Excel de inventario (.xlsx) con sus encabezados.", "error");
        }
    };

    const handleProcesar = async () => {
        const cambios = [
            nuevos && plural(nuevos, "medicamento nuevo", "medicamentos nuevos"),
            ediciones && plural(ediciones, "edición de datos", "ediciones de datos"),
            ajustes && plural(ajustes, "ajuste de stock", "ajustes de stock"),
        ].filter(Boolean);
        const { isConfirmed } = await Swal.fire({
            icon: "warning",
            title: "¿Aplicar los cambios al inventario?",
            text:
                `En la campaña "${campania.nombre}" se aplicarán: ${cambios.join(", ")}.` +
                (ajustes ? ` Los ajustes de stock quedan registrados con tu usuario y el motivo indicado.` : ""),
            showCancelButton: true,
            confirmButtonText: "Sí, aplicar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        setProcesando(true);
        LoadingDefault("Aplicando cambios al inventario...");
        try {
            const { resultados, sinFila: huerfanos } = await aplicarEdicionInventario(filas, {
                campaniaId: campania.id,
                motivo,
                usuario,
                token,
            });
            setFilas(resultados);
            setSinFila(huerfanos);
            setProcesado(true);

            const aplicados = resultados.filter((r) => r.estado === "success").length;
            const fallidos = resultados.filter((r) => r.estado === "error").length;
            Swal.fire({
                icon: fallidos === 0 ? "success" : "warning",
                title: "Edición de inventario finalizada",
                text: `Aplicados: ${aplicados}. Con errores: ${fallidos}.`,
            });
            if (aplicados > 0) onCargado();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "No se pudieron aplicar los cambios"), "error");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <ModalBase
            title="Carga masiva · Editar inventario"
            onClose={onClose}
            maxWidth="max-w-6xl"
            footer={
                <div className="flex w-full flex-col gap-3">
                    {motivoBloqueo && (
                        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {motivoBloqueo}
                        </p>
                    )}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onVolver}
                            disabled={procesando}
                            className="mr-auto rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            ← Cambiar opción
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Cerrar
                        </button>
                        {procesado && (
                            <button
                                type="button"
                                onClick={() => exportarResultadosInventario(filas, campania.codigo)}
                                className="azul-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold"
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Exportar resultado
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleProcesar}
                            disabled={!puedeProcesar}
                            className={`rounded px-4 py-2 text-sm font-semibold ${puedeProcesar ? "verde-btn" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
                        >
                            {procesando ? "Procesando..." : procesado ? "Procesado" : `Aplicar cambios${listos.length ? ` (${listos.length})` : ""}`}
                        </button>
                    </div>
                </div>
            }
        >
            <div className="space-y-4">
                <CampaniaActivaBanner campania={campania} />

                <ol className="list-inside list-decimal space-y-1 text-xs text-gray-600">
                    <li>Descarga la hoja con los medicamentos actuales de la campaña.</li>
                    <li>
                        Cambia sus datos y, para modificar el stock, elige <b>AUMENTAR</b>, <b>DISMINUIR</b> o <b>MANTENER</b> en
                        «AJUSTE DE STOCK» y escribe la «CANTIDAD». Los medicamentos nuevos van en las filas en blanco, sin ID.
                    </li>
                    <li>Sube el Excel: antes de guardar verás qué se hará con cada fila.</li>
                </ol>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => descargarHojaInventario(existentes, campania)}
                        disabled={procesando}
                        className="verde-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        Descargar hoja de inventario <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                    <input ref={selectorArchivo} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleArchivo} />
                    <button
                        type="button"
                        onClick={() => selectorArchivo.current.click()}
                        disabled={procesando}
                        className="verde-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        Subir Excel editado <FontAwesomeIcon icon={faUpload} />
                    </button>
                </div>

                {filas.length > 0 && (
                    <ResumenCarga
                        datos={[
                            { titulo: "Total", valor: filas.length, clase: "bg-gray-100 text-gray-700" },
                            { titulo: "Por aplicar", valor: cuenta("pendiente"), clase: "bg-blue-100 text-blue-800" },
                            { titulo: "Sin cambios", valor: cuenta("sinCambios"), clase: "bg-gray-100 text-gray-700" },
                            { titulo: "Aplicados", valor: cuenta("success"), clase: "bg-green-100 text-green-800" },
                            { titulo: "Con errores", valor: cuenta("error", "invalida"), clase: "bg-red-100 text-red-800" },
                        ]}
                    />
                )}

                {hayAjustes && (
                    <FloatingInput
                        id="motivo-ajustes"
                        label="Motivo de los ajustes de stock (se registra en cada ajuste)"
                        required
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        disabled={procesando || procesado}
                    />
                )}

                <FallosSinFila fallos={sinFila} />

                {filas.length > 0 && (
                    <div className="overflow-auto rounded-lg border border-gray-300">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>
                                    {ENCABEZADOS.map((titulo) => (
                                        <th key={titulo} className="whitespace-nowrap border-b bg-gray-100 px-3 py-2 text-left">
                                            {titulo}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((fila, i) => (
                                    <tr key={i} className={`border-b ${ESTADO[fila.estado].fila}`}>
                                        <td className="whitespace-nowrap px-3 py-2 font-semibold">{ESTADO[fila.estado].etiqueta}</td>
                                        <td className="px-3 py-2">{fila.id ?? "Nuevo"}</td>
                                        <td className="px-3 py-2 font-semibold">{fila.nombre}</td>
                                        <td className="px-3 py-2">{fila.presentacion}</td>
                                        <td className="px-3 py-2">{fila.uso}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-right">{fila.precioUnitario}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-center">{textoStock(fila)}</td>
                                        <td className="min-w-[16rem] px-3 py-2">{fila.mensaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ModalBase>
    );
}
