import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faUpload } from "@fortawesome/free-solid-svg-icons";
import CampaniaActivaBanner from "../../../components/CampaniaActivaBanner";
import ModalBase from "../../../components/ModalBase";
import { mensajeDeError } from "../../../utils/apiSalud";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import {
    descargarPlantillaMedicamentos,
    exportarResultadosMedicamentos,
    guardarCargaMasivaMedicamentos,
    leerExcelMedicamentos,
} from "./ControllerCargaMasivaMedicamentos";

const ESTADO = {
    pendiente: { etiqueta: "— Listo", fila: "" },
    invalida: { etiqueta: "⚠ Inválida", fila: "bg-yellow-50" },
    success: { etiqueta: "✔ Registrado", fila: "bg-green-50" },
    error: { etiqueta: "✖ Error", fila: "bg-red-50" },
};

const ENCABEZADOS = ["Estado", "Nombre", "Presentación", "Uso", "Laboratorio", "Marca", "Unidad medida", "Stock mín.", "Mensaje"];

const Dato = ({ titulo, valor, clase }) => (
    <div className={`rounded px-4 py-2 shadow-sm ${clase}`}>
        <p className="text-sm">{titulo}</p>
        <p className="text-xl font-bold">{valor}</p>
    </div>
);

// Carga de varios medicamentos a la vez desde un Excel, siempre a la campaña activa.
// `existentes` son los medicamentos que la campaña ya tiene (para avisar de duplicados).
export default function CargaMasivaMedicamentos({ token, campania, existentes, onClose, onCargado }) {
    const [filas, setFilas] = useState([]);
    const [sinFila, setSinFila] = useState([]); // fallos del backend que no se pudieron asociar a una fila
    const [procesando, setProcesando] = useState(false);
    const [procesado, setProcesado] = useState(false);
    const selectorArchivo = useRef(null);

    const listos = filas.filter((f) => f.estado === "pendiente");
    const posiblesDuplicados = listos.filter((f) => f.mensaje).length;
    const puedeProcesar = listos.length > 0 && !procesando && !procesado; // procesar dos veces crearía duplicados
    const cuenta = (...estados) => filas.filter((f) => estados.includes(f.estado)).length;

    const handleArchivo = async (e) => {
        const archivo = e.target.files[0];
        e.target.value = "";
        if (!archivo) return;

        try {
            setFilas(await leerExcelMedicamentos(archivo, existentes));
            setSinFila([]);
            setProcesado(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo leer el archivo. Verifica que sea un Excel (.xlsx o .xls) con las columnas de la plantilla.", "error");
        }
    };

    const handleProcesar = async () => {
        const { isConfirmed } = await Swal.fire({
            icon: "warning",
            title: "¿Procesar y guardar los medicamentos?",
            text:
                `Se enviarán ${listos.length} medicamento(s) a la campaña "${campania.nombre}". Todos se crean con stock 0; ` +
                `el stock mínimo indicado se usa como umbral de alerta.` +
                (posiblesDuplicados ? ` ${posiblesDuplicados} podrían estar duplicados y se crearían como filas independientes.` : ""),
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        setProcesando(true);
        LoadingDefault("Registrando medicamentos...");
        try {
            const { resultados, sinFila: huerfanos, respuesta } = await guardarCargaMasivaMedicamentos(filas, campania.id, token);
            setFilas(resultados);
            setSinFila(huerfanos);
            setProcesado(true);

            const registrados = respuesta?.procesadosConExito ?? resultados.filter((r) => r.estado === "success").length;
            const fallidos = respuesta?.totalFallidos ?? resultados.filter((r) => r.estado === "error").length;
            Swal.fire({
                icon: fallidos === 0 ? "success" : "warning",
                title: "Carga masiva finalizada",
                text: `Registrados: ${registrados}. Con errores: ${fallidos}.`,
            });
            if (registrados > 0) onCargado();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "No se pudo procesar la carga masiva"), "error");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <ModalBase
            title="Carga masiva de medicamentos"
            onClose={onClose}
            maxWidth="max-w-5xl"
            footer={
                <>
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
                            onClick={() => exportarResultadosMedicamentos(filas, campania.codigo)}
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
                        {procesando ? "Procesando..." : procesado ? "Procesado" : `Procesar y guardar${listos.length ? ` (${listos.length})` : ""}`}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <CampaniaActivaBanner campania={campania} />

                <p className="text-xs text-gray-500">
                    Obligatorios: nombre y presentación (las filas que no los tengan no se envían). El stock mínimo vacío se registra
                    como 0. Todos los medicamentos se crean con stock 0; para cargar stock usa después el ingreso de cada medicamento (+).
                </p>

                <div className="flex flex-wrap gap-3">
                    <input ref={selectorArchivo} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleArchivo} />
                    <button
                        type="button"
                        onClick={() => selectorArchivo.current.click()}
                        disabled={procesando}
                        className="verde-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        Subir Excel <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <button
                        type="button"
                        onClick={descargarPlantillaMedicamentos}
                        disabled={procesando}
                        className="verde-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        Descargar plantilla <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                </div>

                {filas.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        <Dato titulo="Total" valor={filas.length} clase="bg-gray-100 text-gray-700" />
                        <Dato titulo="Listos" valor={cuenta("pendiente")} clase="bg-blue-100 text-blue-800" />
                        <Dato titulo="Registrados" valor={cuenta("success")} clase="bg-green-100 text-green-800" />
                        <Dato titulo="Con errores" valor={cuenta("error", "invalida")} clase="bg-red-100 text-red-800" />
                    </div>
                )}

                {sinFila.length > 0 && (
                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                        <p className="font-semibold">
                            El servidor reportó {sinFila.length} fallo(s) que no se pudieron asociar a una fila de la lista, así que
                            alguna fila marcada como registrada podría no estarlo (revisa la lista de medicamentos):
                        </p>
                        <ul className="list-inside list-disc">
                            {sinFila.map((fallo, i) => (
                                <li key={i}>
                                    {fallo.nombresPa || "(sin nombre)"}: {fallo.motivoFallo}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
                                        <td className="px-3 py-2 font-semibold">{fila.nombre}</td>
                                        <td className="px-3 py-2">{fila.presentacion}</td>
                                        <td className="px-3 py-2">{fila.uso}</td>
                                        <td className="px-3 py-2">{fila.laboratorio}</td>
                                        <td className="px-3 py-2">{fila.marca}</td>
                                        <td className="px-3 py-2">{fila.unidadMedida}</td>
                                        <td className="px-3 py-2 text-center">{fila.stockMinimo}</td>
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
