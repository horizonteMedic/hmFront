import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

// Máximo de exámenes pendientes que se nombran en la celda; el resto se resume como "+N".
const MAX_NOMBRADOS = 2;

const descripcionPendientes = (pendientes) => {
    const nombrados = pendientes.slice(0, MAX_NOMBRADOS).join(", ");
    const resto = pendientes.length - MAX_NOMBRADOS;
    return resto > 0 ? `${nombrados} +${resto}` : nombrados;
};

// `area` undefined = el área no está en el protocolo de este paciente.
const CeldaArea = ({ area }) => {
    if (!area) return <span className="text-[22px] font-bold text-gray-300">–</span>;

    if (area.completado) {
        return (
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-green-600 text-[18px] text-white">
                <FontAwesomeIcon icon={faCheck} />
            </span>
        );
    }

    return (
        <div className="flex min-w-0 items-center gap-2 px-1" title={`Falta: ${area.pendientes.join(", ")}`}>
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-red-600 text-[18px] text-white">
                <FontAwesomeIcon icon={faXmark} />
            </span>
            <span className="line-clamp-2 text-[15px] font-semibold leading-tight text-red-700">
                {descripcionPendientes(area.pendientes)}
            </span>
        </div>
    );
};

const FilaPaciente = ({ paciente, columnas, plantillaColumnas }) => {
    const { nombres, color, areasPorId, total, completadas, finalizado } = paciente;

    return (
        <article
            className={`grid h-full items-center overflow-hidden rounded-lg border-l-[10px] bg-white shadow-md ${
                finalizado ? "border-green-600" : "border-red-600"
            }`}
            style={{ gridTemplateColumns: plantillaColumnas }}
        >
            <span
                className="mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full text-[20px] font-extrabold text-gray-900"
                style={{ backgroundColor: color.hex ?? "#e5e7eb" }}
            >
                {color.letra}
            </span>

            <p className="line-clamp-2 pr-3 text-[20px] font-extrabold uppercase leading-tight text-[#0e4d8c]">
                {nombres}
            </p>

            {columnas.map((columna) => (
                <div
                    key={columna.id}
                    className="flex h-full items-center justify-center border-l border-gray-200"
                >
                    <CeldaArea area={areasPorId[columna.id]} />
                </div>
            ))}

            <span
                className={`mx-auto rounded-md px-3 py-0.5 text-[20px] font-extrabold tabular-nums ${
                    finalizado ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
            >
                {total === 0 ? "–" : `${completadas}/${total}`}
            </span>
        </article>
    );
};

export default FilaPaciente;
