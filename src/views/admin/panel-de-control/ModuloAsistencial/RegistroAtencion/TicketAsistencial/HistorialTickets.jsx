import { faCheck, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const norm = (valor) => String(valor ?? "").trim().toUpperCase();

// "2026-11-04" -> "04/11/2026" (sin pasar por Date: evita el corrimiento de un día por zona horaria).
const formatearFecha = (fecha) => {
    const [anio, mes, dia] = String(fecha ?? "").split("-");
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha ?? "";
};

// ¿El formulario sigue mostrando la empresa / cargo / área de este ticket? Si el usuario los edita
// a mano después de elegirlo, la marca de "seleccionado" se apaga sola.
const coincide = (ticket, contexto) =>
    norm(ticket.empresa) === norm(contexto.empresa) &&
    norm(ticket.cargo) === norm(contexto.cargo) &&
    norm(ticket.area) === norm(contexto.area);

// Barra lateral con los tickets anteriores del paciente cargado (GET /api/tickets/historial).
// Al elegir uno, el formulario toma su Empresa / Cargo / Área (lo resuelve `onSelect`).
// Solo se monta cuando el paciente ya tuvo tickets; ver TicketAsistencial.
export default function HistorialTickets({ tickets, seleccionadoId, contextoActual, onSelect }) {
    return (
        <aside
            aria-label="Tickets anteriores del paciente"
            className="order-first lg:absolute lg:right-0 lg:top-[15px] w-full lg:w-[240px] rounded-md border-[1px] border-gray-300 bg-white shadow-sm"
        >
            <div className="azuloscurobackground flex items-center justify-between gap-2 rounded-t-md px-[12px] py-[8px] text-white">
                <span className="flex items-center gap-2 text-xl font-semibold">
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                    Tickets anteriores
                </span>
                <span className="rounded-full bg-white/20 px-[8px] text-lg font-semibold">{tickets.length}</span>
            </div>

            <p className="px-[12px] pt-[8px] text-lg text-gray-500">
                Seleccione uno para completar Empresa, Cargo y Área.
            </p>

            <ul className="m-0 max-h-[260px] list-none space-y-1 overflow-y-auto p-[8px]">
                {tickets.map((t) => {
                    const activo = seleccionadoId === t.id && coincide(t, contextoActual);
                    const tipoDocumento = String(t.pacienteTipoDocumento ?? "DOC").replace(/_/g, " ");
                    const detalle = [
                        `Empresa: ${t.empresa || "—"}`,
                        `Cargo: ${t.cargo || "—"}`,
                        `Área: ${t.area || "—"}`,
                    ].join("\n");

                    return (
                        <li key={t.id ?? t.numeroTicket}>
                            <button
                                type="button"
                                title={detalle}
                                aria-pressed={activo}
                                onClick={() => onSelect(t)}
                                className={`block w-full rounded border-[1px] px-[8px] py-[6px] text-left transition-colors ${activo
                                    ? "border-[#233245] bg-blue-50 ring-1 ring-[#233245]"
                                    : "border-gray-200 bg-[#fff] hover:bg-gray-100"
                                    }`}
                            >
                                <span className="flex items-baseline justify-between gap-2">
                                    <span className="flex items-center gap-1 text-xl font-bold text-gray-800">
                                        {activo && <FontAwesomeIcon icon={faCheck} className="text-green-600" />}
                                        Ticket N° {t.numeroTicket}
                                    </span>
                                    <span className="text-lg text-gray-500">{formatearFecha(t.fechaTicket)}</span>
                                </span>
                                <span className="block text-lg text-gray-600">
                                    {tipoDocumento}: {t.pacienteNumeroDocumento ?? "—"}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
