import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

// `area` undefined = el área no está en el protocolo de este paciente.
const CeldaArea = ({ area }) => {
    if (!area) return <span className="text-[22px] font-bold text-gray-300">–</span>;

    return (
        <span
            className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[18px] text-white ${
                area.completado ? "bg-green-600" : "bg-red-600"
            }`}
        >
            <FontAwesomeIcon icon={area.completado ? faCheck : faXmark} />
        </span>
    );
};

const FilaPaciente = ({ paciente, columnas, plantillaColumnas }) => {
    const { nombres, color, areasPorId, total, completadas, finalizado } = paciente;

    return (
        <article
            className={`grid h-full items-center overflow-hidden rounded-lg border-l-[10px] bg-white shadow-md ${
                total === 0 ? "border-gray-300" : finalizado ? "border-green-600" : "border-red-600"
            }`}
            style={{ gridTemplateColumns: plantillaColumnas }}
        >
            <span
                className="mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full text-[20px] font-extrabold text-gray-900"
                style={{ backgroundColor: color.hex ?? "#e5e7eb" }}
            >
                {color.letra}
            </span>

            <p className="truncate pr-3 text-[20px] font-extrabold uppercase text-[#0e4d8c]">
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
