import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faNotesMedical, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { rangoMesActual } from "../../Inventario/Compartido/inventarioUtils";
import { GenerarExcelAtenciones, GenerarPdfAtenciones } from "./controllerAtenciones";

const CLASES_BOTON = `
    flex items-center justify-center gap-2 text-white font-semibold px-6 py-2.5 rounded-md
    transition-all duration-150 ease-out active:scale-95
    disabled:opacity-60 disabled:cursor-not-allowed`;

export default function Atenciones() {
    const { token } = useSessionData();
    const [rango, setRango] = useState(rangoMesActual);
    // Formato que se está generando ("excel" o "pdf"), o "" si no hay ninguno: mientras tanto los dos botones quedan bloqueados.
    const [generando, setGenerando] = useState("");

    const handleGenerar = async (formato, generar) => {
        setGenerando(formato);
        try {
            await generar(rango, token);
        } finally {
            setGenerando("");
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
                            Exporta las atenciones del rango con los datos del paciente, diagnóstico, tratamiento de triaje, medicinas, quién atendió y la
                            firma del paciente, en Excel o en PDF.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleGenerar("excel", GenerarExcelAtenciones)}
                        disabled={generando !== ""}
                        className={`bg-[#257a4e] hover:bg-[#1e6440] ${CLASES_BOTON}`}
                    >
                        <FontAwesomeIcon icon={generando === "excel" ? faSpinner : faFileExcel} spin={generando === "excel"} />
                        {generando === "excel" ? "Generando..." : "Excel"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleGenerar("pdf", GenerarPdfAtenciones)}
                        disabled={generando !== ""}
                        className={`bg-[#b42318] hover:bg-[#912018] ${CLASES_BOTON}`}
                    >
                        <FontAwesomeIcon icon={generando === "pdf" ? faSpinner : faFilePdf} spin={generando === "pdf"} />
                        {generando === "pdf" ? "Generando..." : "PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
}
