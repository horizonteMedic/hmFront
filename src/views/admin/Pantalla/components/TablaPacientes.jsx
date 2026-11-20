import FilaPaciente from "./FilaPaciente";

const ANCHO_LETRA = "56px";
const ANCHO_NOMBRE = "400px";
const ANCHO_AVANCE = "96px";

const TituloColumna = ({ children, className = "" }) => (
    <div
        className={`flex min-w-0 items-end justify-center overflow-hidden break-words px-1 pb-1 text-center text-[14px] font-extrabold uppercase leading-tight text-[#0e4d8c] ${className}`}
    >
        {children}
    </div>
);

/**
 * Tabla estilo matriz: una fila por paciente y una columna por área.
 * El área solo figura como lista (✓) al 100%; si falta algún examen se marca con ✗.
 */
const TablaPacientes = ({ pacientes, columnas, filas }) => {
    const plantillaColumnas = `${ANCHO_LETRA} ${ANCHO_NOMBRE} repeat(${columnas.length}, minmax(0, 1fr)) ${ANCHO_AVANCE}`;

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-12 py-4">
            <div
                className="grid h-[56px] shrink-0 pl-[10px]"
                style={{ gridTemplateColumns: plantillaColumnas }}
            >
                <span />
                <TituloColumna className="!justify-start !text-[16px] !text-gray-500">Paciente</TituloColumna>
                {columnas.map((columna) => (
                    <TituloColumna key={columna.id}>{columna.nombre}</TituloColumna>
                ))}
                <TituloColumna className="!text-[16px] !text-gray-500">Áreas</TituloColumna>
            </div>

            <div
                className="grid min-h-0 flex-1 gap-y-[6px]"
                style={{ gridTemplateRows: `repeat(${filas}, minmax(0, 1fr))` }}
            >
                {pacientes.map((paciente) => (
                    <FilaPaciente
                        key={paciente.id}
                        paciente={paciente}
                        columnas={columnas}
                        plantillaColumnas={plantillaColumnas}
                    />
                ))}
            </div>
        </div>
    );
};

export default TablaPacientes;
