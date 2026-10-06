import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../../../../../store/auth";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { descargarLibro } from "../../utils/descargarLibro";
import { generarReporteMedicamentos } from "./controllerReportesInventario";

// Reporte de los medicamentos de la campaña activa (cada campaña tiene los suyos y su propio stock).
export default function ReportesInventario({ campania }) {
    const token = useAuthStore((state) => state.token);
    const [generando, setGenerando] = useState(false);

    const handleExportar = async () => {
        setGenerando(true);
        LoadingDefault("Generando Excel...");
        try {
            const resultado = await generarReporteMedicamentos({ token, campania });
            if (!resultado) return Swal.fire("Sin datos", "Esta campaña no tiene medicamentos para exportar", "info");

            await descargarLibro(resultado.libro, resultado.nombreArchivo);
            Swal.close();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo generar el reporte", "error");
        } finally {
            setGenerando(false);
        }
    };

    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="max-w-md text-sm text-gray-600">
                Excel con los medicamentos de la campaña «{campania.nombre}»: presentación, uso, stock actual y stock mínimo.
            </p>
            <button
                type="button"
                onClick={handleExportar}
                disabled={generando}
                className="flex items-center gap-3 rounded-2xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-green-700 active:bg-green-800 disabled:opacity-60"
            >
                <FontAwesomeIcon icon={faFileExcel} className="text-2xl" />
                {generando ? "Generando..." : "Exportar Medicamentos"}
            </button>
        </div>
    );
}
