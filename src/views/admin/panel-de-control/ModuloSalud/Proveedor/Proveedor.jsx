import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine";
import TablaTemplate from "../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../hooks/useSessionData";
import { LoadingDefault } from "../../../../utils/functionUtils";
import { buscarPersonasReniec, LIMITE_RESULTADOS_RENIEC } from "./controllerProveedor";

const initialForm = { nombres: "", apellidoPaterno: "", apellidoMaterno: "" };

const columns = [
    {
        label: "DNI",
        accessor: "dni",
        width: "140px",
        render: (row) => <span className="font-bold">{row.dni}</span>,
    },
    {
        label: "Nombre Completo",
        accessor: "nombreCompleto",
    },
];

export default function Proveedor() {
    const { token } = useSessionData();
    const [form, setForm] = useState(initialForm);
    const [resultados, setResultados] = useState([]);
    const [buscado, setBuscado] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
    };

    const handleBuscar = async () => {
        if (!form.nombres && !form.apellidoPaterno && !form.apellidoMaterno) {
            Swal.fire("Atención", "Ingrese al menos un dato para buscar", "warning");
            return;
        }

        LoadingDefault("Buscando en RENIEC...");
        const res = await buscarPersonasReniec(form, token);
        setResultados(res);
        setBuscado(true);
        Swal.close();
    };

    const handleKeyUp = (e) => {
        if (e.key === "Enter") handleBuscar();
    };

    const handleLimpiar = () => {
        setForm(initialForm);
        setResultados([]);
        setBuscado(false);
    };

    return (
        <div className="px-4 max-w-[95%] mx-auto space-y-4">
            <SectionFieldset legend="Buscar Personas (RENIEC)" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputTextOneLine
                        label="Nombres"
                        name="nombres"
                        value={form.nombres}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        labelWidth="130px"
                    />
                    <InputTextOneLine
                        label="Apellido Paterno"
                        name="apellidoPaterno"
                        value={form.apellidoPaterno}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        labelWidth="130px"
                    />
                    <InputTextOneLine
                        label="Apellido Materno"
                        name="apellidoMaterno"
                        value={form.apellidoMaterno}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        labelWidth="130px"
                    />
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={handleBuscar}
                        className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSearch} /> Buscar
                    </button>
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
            </SectionFieldset>

            {buscado && (
                <SectionFieldset legend={`Resultados (${resultados.length})`}>
                    {resultados.length >= LIMITE_RESULTADOS_RENIEC && (
                        <p className="text-xs text-orange-600 mb-2">
                            Se alcanzó el límite de {LIMITE_RESULTADOS_RENIEC} resultados. Puede haber más coincidencias; afine la búsqueda para acotarlas.
                        </p>
                    )}
                    <TablaTemplate
                        columns={columns}
                        data={resultados}
                        height={500}
                        emptyText="No se encontraron personas con esos datos"
                    />
                </SectionFieldset>
            )}
        </div>
    );
}
