import { formatearTicketAsistencial } from "../../../../../utils/ticketAsistencial";
import { faCheck, faClockRotateLeft, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";

const COLUMNAS = ["N° Ticket", "Fecha y hora", "Paciente", "Médico", "Registrado por", "Triaje", "Historia", "Odontología", "Recetas", "Estado"];

// Color de cada fila según el estado de atención que calcula el backend
const COLOR_ESTADO = {
    ATENDIDO: "bg-green-200 hover:bg-green-300",
    INCOMPLETO: "bg-yellow-200 hover:bg-yellow-300",
    "NO ATENDIDO": "bg-red-200 hover:bg-red-300",
};
const COLOR_ESTADO_DEFECTO = "bg-slate-50 hover:bg-slate-100";

const CELDA = "px-2 py-[6px] text-slate-800";

// ✓ si el paso se hizo, – si no
function Paso({ hecho, children }) {
    if (!hecho) return <FontAwesomeIcon icon={faMinus} className="text-slate-400" title="Pendiente" />;
    return (
        <span className="inline-flex items-center gap-1 font-semibold text-green-800">
            <FontAwesomeIcon icon={faCheck} />
            {children}
        </span>
    );
}

// Últimos tickets de la sede, con búsqueda por apellidos/nombres (al escribir) o por N° de ticket (Enter).
// El estado y las consultas viven en `listado` (ver useListadoTickets).
// Click derecho sobre una fila imprime ese ticket (`onImprimir` recibe su N° de ticket).
export default function ListadoTickets({ listado, nombreMedico, onSinResultado, onImprimir }) {
    const { registros, cargando, busqueda } = listado;

    const buscarPorNumero = async (e) => {
        if (e.key !== "Enter") return;
        const encontrado = await listado.buscarPorNumero();
        if (!encontrado) onSinResultado();
    };

    return (
        <SectionFieldset legend="Últimos tickets" className="grid gap-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                    {registros.length} {registros.length === 1 ? "registro" : "registros"}
                </span>
                <span className="text-sm text-gray-700">
                    <b className="font-semibold">Click derecho</b> sobre un ticket lo imprime
                </span>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-[3fr_2fr]">
                <InputTextOneLine
                    label="Buscar por nombre"
                    name="buscarTicketNombre"
                    value={busqueda.nombre}
                    onChange={(e) => listado.cambiarNombre(e.target.value.toUpperCase())}
                    placeholder="Apellidos o nombres"
                    labelWidth="150px"
                    stackOnMobile
                    autocomplete="off"
                />
                <InputTextOneLine
                    label="Buscar por N° ticket" prefijo="A-"
                    name="buscarTicketNumero"
                    value={busqueda.numero}
                    onChange={(e) => /^\d{0,9}$/.test(e.target.value) && listado.cambiarNumero(e.target.value)}
                    onKeyUp={buscarPorNumero}
                    placeholder="N° y Enter"
                    inputMode="numeric"
                    labelWidth="160px"
                    stackOnMobile
                    autocomplete="off"
                />
            </div>

            <div className="max-h-[360px] min-h-[200px] overflow-auto rounded-md border-[1px] border-slate-200">
                <table className="w-full text-center text-base">
                    <thead>
                        <tr>
                            {COLUMNAS.map((columna) => (
                                <th
                                    key={columna}
                                    className="sticky top-0 z-10 whitespace-nowrap bg-slate-100 px-2 py-[6px] font-bold text-slate-700 shadow-[inset_0_-1px_0_#cbd5e1]"
                                >
                                    {columna}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {registros.length === 0 && (
                            <tr>
                                <td colSpan={COLUMNAS.length} className="px-2 py-[28px] text-slate-500">
                                    {cargando ? "Cargando..." : "Sin registros"}
                                </td>
                            </tr>
                        )}
                        {registros.map((t) => (
                            <tr
                                key={t.idTicket ?? t.numeroTicket}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    onImprimir(t.numeroTicket);
                                }}
                                className={`cursor-pointer transition-colors ${COLOR_ESTADO[t.estado] ?? COLOR_ESTADO_DEFECTO}`}
                            >
                                <td className={`${CELDA} font-semibold`}>{formatearTicketAsistencial(t.numeroTicket)}</td>
                                <td className={`${CELDA} whitespace-nowrap`}>{t.fechaTicket}</td>
                                <td className={`${CELDA} text-left`}>{t.paciente}</td>
                                <td className={`${CELDA} text-left`}>{nombreMedico(t)}</td>
                                <td className={`${CELDA} text-left`}>{t.registradoPor}</td>
                                <td className={CELDA}>
                                    <Paso hecho={t.pasoTriaje} />
                                </td>
                                <td className={CELDA}>
                                    <Paso hecho={t.pasoHistoria}>{t.tipoHistoria}</Paso>
                                </td>
                                <td className={CELDA}>
                                    <Paso hecho={t.pasoOdontologia} />
                                </td>
                                <td className={CELDA}>{t.tieneReceta ? t.cantidadRecetas : <FontAwesomeIcon icon={faMinus} className="text-slate-400" />}</td>
                                <td className={`${CELDA} whitespace-nowrap font-semibold`}>{t.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionFieldset>
    );
}
