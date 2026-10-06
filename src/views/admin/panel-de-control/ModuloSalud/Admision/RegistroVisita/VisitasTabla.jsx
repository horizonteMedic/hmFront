import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import EstadoVisitaPill from "../../components/EstadoVisitaPill";

const ESTILO_ESPECIALIDAD = {
    PASO: { punto: "bg-green-500", texto: "text-green-700" },
    NO_PASO: { punto: "bg-red-500", texto: "text-red-600" },
    PENDIENTE: { punto: "bg-gray-400", texto: "text-gray-600" },
};

// El estado puede llegar como "NO_PASO" o "NO PASO"
const estiloEspecialidad = (estado) =>
    ESTILO_ESPECIALIDAD[String(estado ?? "").replace(/ /g, "_")] ?? ESTILO_ESPECIALIDAD.PENDIENTE;

function Especialidades({ lista }) {
    return (
        <ul className="space-y-1">
            {lista.map((especialidad) => {
                const estilo = estiloEspecialidad(especialidad.estado);
                return (
                    <li key={especialidad.id ?? especialidad.nombre} className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${estilo.punto}`} />
                        <span className={estilo.texto}>{especialidad.nombre}</span>
                    </li>
                );
            })}
        </ul>
    );
}

function Parentescos({ lista }) {
    if (!lista?.length) return null;

    return (
        <ul className="space-y-1">
            {lista.map((p, i) => (
                <li key={i} className="text-xs leading-tight">
                    <span className="font-semibold text-purple-700">{p.tipoRelacion}</span>
                    <span> de: {p.nombreRelacionado}</span>
                    {p.dniRelacionado && <span className="opacity-60"> ({p.dniRelacionado})</span>}
                </li>
            ))}
        </ul>
    );
}

// Visitas de la campaña. Clic en la fila: abrirla en Registro de Especialidades; clic derecho: imprimir
// el ticket (con confirmación); botón de impresora junto al N° de orden: imprimirlo directo (en táctil
// no hay clic derecho, y así queda visible sin desplazarse).
export default function VisitasTabla({ visitas, emptyText, onSeleccionar, onImprimir, onClickDerecho }) {
    const columns = [
        {
            label: "N° Orden",
            accessor: "norden",
            width: "130px",
            render: (row) => (
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{row.norden}</span>
                        <button
                            type="button"
                            title="Imprimir ticket"
                            aria-label={`Imprimir ticket N° ${row.norden}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onImprimir(row);
                            }}
                            className="rounded-md border border-current px-2 py-1 text-sm hover:bg-white/20"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                    {row.estadoVisita && row.estadoVisita !== "ABIERTA" && <EstadoVisitaPill estado={row.estadoVisita} />}
                </div>
            ),
        },
        { label: "DNI", accessor: "dni", width: "120px", render: (row) => <span className="font-bold">{row.dni}</span> },
        { label: "Nombres", accessor: "nombres", render: (row) => `${row.nombres} ${row.apellidos}` },
        { label: "Fecha Visita", accessor: "fechaVisita", width: "130px", render: (row) => formatearFechaCorta(row.fechaVisita) },
        { label: "Parentesco", accessor: "parentescos", render: (row) => <Parentescos lista={row.parentescos} /> },
        { label: "Especialidades", accessor: "especialidades", render: (row) => <Especialidades lista={row.especialidades ?? []} /> },
    ];

    return (
        <TablaTemplate
            columns={columns}
            data={visitas}
            height="65vh"
            emptyText={emptyText}
            onRowClick={onSeleccionar}
            onRowRightClick={onClickDerecho}
        />
    );
}
