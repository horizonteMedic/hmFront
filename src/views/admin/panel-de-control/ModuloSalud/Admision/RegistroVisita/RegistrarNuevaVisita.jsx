import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { BuscarPacientePorDniONombre, BuscarVisitasPrevias } from "./controllerRegistroVisita";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import Swal from "sweetalert2";

const initialBusqueda = { dni: "", nombresCompletos: "" };

const columns = [
    {
        label: "N° Orden",
        accessor: "norden",
        width: "110px",
        render: (row) => <span className="font-bold">{row.norden}</span>,
    },
    {
        label: "Estado",
        accessor: "estado",
        width: "110px",
        render: (row) => (
            <span
                className={`inline-block px-2 py-0.5 rounded text-sm font-semibold ${row.estado === "ABIERTA" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                    }`}
            >
                {row.estado}
            </span>
        ),
    },
    {
        label: "Fecha Visita",
        accessor: "fechaVisita",
        width: "130px",
        render: (row) => formatearFechaCorta(row.fechaVisita),
    },
    {
        label: "DNI",
        accessor: "dni",
        width: "110px",
        render: (row) => <span className="font-bold">{row.dni}</span>,
    },
    {
        label: "Nombres y Apellidos",
        accessor: "nombres",
        render: (row) => <span>{row.nombres} {row.apellidos}</span>,
    },
];

export default function RegistrarNuevaVisita({ onClose, token, onRegistrar }) {
    const [busqueda, setBusqueda] = useState(initialBusqueda);
    const [resultados, setResultados] = useState([]);
    const [buscado, setBuscado] = useState(false);
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const upper = value.toUpperCase();

        // Los campos son excluyentes: escribir en uno limpia el otro
        if (name === "dni") {
            setBusqueda({ dni: upper, nombresCompletos: "" });
        } else {
            setBusqueda({ dni: "", nombresCompletos: upper });
        }
    };

    const buscar = async () => {
        if (!busqueda.dni && !busqueda.nombresCompletos) {
            Swal.fire("Atención", "Ingrese un DNI o nombres completos para buscar", "warning");
            return;
        }

        LoadingDefault("Buscando...");

        // 1) Verificar que el paciente exista
        const paciente = await BuscarPacientePorDniONombre(
            { dni: busqueda.dni, nombres: busqueda.nombresCompletos },
            token
        );

        if (!paciente) {
            Swal.close();
            setBuscado(false);
            setPacienteEncontrado(null);
            setResultados([]);
            Swal.fire("No encontrado", "No se encontró un paciente con esos datos", "warning");
            return;
        }

        const pacienteInfo = {
            pacienteId: paciente.id,
            dni: paciente.numeroDocumento,
            nombres: `${paciente.nombres} ${paciente.apellidos}`,
        };
        setPacienteEncontrado(pacienteInfo);

        // 2) Con el paciente confirmado, buscar sus visitas anteriores
        const res = await BuscarVisitasPrevias({ dni: pacienteInfo.dni }, token);
        setResultados(res);
        setBuscado(true);
        Swal.close();
    };

    const handleKeyUp = (e) => {
        if (e.key === "Enter") buscar();
    };

    const handleRegistrar = () => {
        onRegistrar?.(pacienteEncontrado);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-primarioClaro rounded-lg w-[90%] max-w-4xl max-h-[90vh] flex flex-col p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-blue-600 text-xl font-semibold">Registrar Nueva Visita</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: "16px" }}
                        onClick={onClose}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    <InputTextOneLine
                        label="DNI"
                        name="dni"
                        value={busqueda.dni}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        labelWidth="130px"
                    />
                    <InputTextOneLine
                        label="Nombres Completos"
                        name="nombresCompletos"
                        value={busqueda.nombresCompletos}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        labelWidth="130px"
                    />
                    <div className="flex justify-end items-center">
                        <button
                            type="button"
                            onClick={buscar}
                            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 h-fit"
                        >
                            <FontAwesomeIcon icon={faSearch} /> Buscar
                        </button>
                    </div>

                </div>

                {buscado && (
                    <div className="flex-1 overflow-hidden flex flex-col gap-3">
                        <p className="font-semibold mb-2">
                            {resultados.length > 0
                                ? "Registros anteriores encontrados:"
                                : "No se encontraron registros anteriores para este paciente."}
                        </p>
                        <TablaTemplate
                            columns={columns}
                            data={resultados}
                            height={300}
                        />
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleRegistrar}
                                className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCheck} /> Registrar Visita para {pacienteEncontrado?.nombres}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
