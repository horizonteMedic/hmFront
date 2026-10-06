import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { getToday } from "../../../../../utils/helpers";
import CampaniaActivaBanner from "../../components/CampaniaActivaBanner";
import ModalBase from "../../components/ModalBase";
import { descargarLibro } from "../../utils/descargarLibro";

// Modal común de los reportes en Excel (ver REPORTES): rango de fechas dentro de la campaña activa.
// `reporte.generar({ token, campania, fechaInicio, fechaFin })` devuelve { libro, nombreArchivo }
// o null si no hay datos.
export default function ModalReporte({ reporte, token, campania, onClose }) {
    const hoy = getToday();
    const [fechas, setFechas] = useState({ fechaInicio: hoy, fechaFin: hoy });
    const [generando, setGenerando] = useState(false);

    const handleChange = ({ target: { name, value } }) => setFechas((f) => ({ ...f, [name]: value }));

    const handleGenerar = async () => {
        if (!fechas.fechaInicio || !fechas.fechaFin) {
            return Swal.fire("Atención", "Selecciona la fecha de inicio y la fecha fin", "warning");
        }
        if (fechas.fechaInicio > fechas.fechaFin) {
            return Swal.fire("Atención", "La fecha de inicio no puede ser posterior a la fecha fin", "warning");
        }

        setGenerando(true);
        LoadingDefault("Generando reporte");
        try {
            const resultado = await reporte.generar({ token, campania, ...fechas });
            if (!resultado) return Swal.fire("Sin datos", "No hay registros para exportar", "info");

            await descargarLibro(resultado.libro, resultado.nombreArchivo);
            Swal.fire("Generado", "Reporte generado correctamente", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un error al generar el reporte", "error");
        } finally {
            setGenerando(false);
        }
    };

    return (
        <ModalBase
            title={reporte.titulo}
            onClose={onClose}
            maxWidth="max-w-xl"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerar}
                        disabled={generando}
                        className="verde-btn flex items-center gap-2 rounded px-5 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faFileExcel} />
                        {generando ? "Generando..." : "Generar reporte"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <CampaniaActivaBanner campania={campania} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputTextOneLine label="Fecha inicio" name="fechaInicio" type="date" labelOnTop value={fechas.fechaInicio} onChange={handleChange} />
                    <InputTextOneLine label="Fecha fin" name="fechaFin" type="date" labelOnTop value={fechas.fechaFin} onChange={handleChange} />
                </div>

                <p className="text-xs text-gray-500">{reporte.descripcion}</p>
            </div>
        </ModalBase>
    );
}
