import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faNotesMedical, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { rangoMesActual } from "../../Inventario/Compartido/inventarioUtils";
import { GenerarExcelAtenciones } from "./controllerAtenciones";

export default function Atenciones() {
    const { token } = useSessionData();
    const [rango, setRango] = useState(rangoMesActual);
    const [generando, setGenerando] = useState(false);

    const handleGenerar = async () => {
        setGenerando(true);
        try {
            await GenerarExcelAtenciones(rango, token);
        } finally {
            setGenerando(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#fc6b03]/10 text-[#fc6b03] shrink-0">
                        <FontAwesomeIcon icon={faNotesMedical} size="lg" />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#233245]">Registro de Atenciones</h2>
                        <p className="text-sm text-gray-500">
                            Exporta las atenciones del rango con los datos del paciente, diagnóstico, medicinas, quién atendió y la firma del paciente.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelOnTop
                        value={rango.desde}
                        max={rango.hasta || undefined}
                        onChange={(e) => setRango((prev) => ({ ...prev, desde: e.target.value }))}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelOnTop
                        value={rango.hasta}
                        onChange={(e) => setRango((prev) => ({ ...prev, hasta: e.target.value }))}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleGenerar}
                    disabled={generando}
                    className="w-full flex items-center justify-center gap-2 bg-[#257a4e] hover:bg-[#1e6440] text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-150 ease-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={generando ? faSpinner : faFileExcel} spin={generando} />
                    {generando ? "Generando..." : "Excel"}
                </button>
            </div>
        </div>
    );
}
