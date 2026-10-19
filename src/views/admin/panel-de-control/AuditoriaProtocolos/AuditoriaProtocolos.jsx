import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionFieldset from "../../../components/reusableComponents/SectionFieldset";
import { useAuthStore } from "../../../../store/auth";
import AreaExamenes from "./AreaExamenes";
import BuscadorOrden from "./BuscadorOrden";
import DatosOrden from "./DatosOrden";
import ModalExamen from "./ModalExamen";
import ResumenProgreso from "./ResumenProgreso";
import { resumirExamenes } from "./controllerAuditoriaProtocolos";
import useHojaRuta from "./useHojaRuta";

const Aviso = ({ children, className = "border-gray-400 text-gray-600" }) => (
    <div className={`rounded-lg border border-dashed py-10 text-center ${className}`}>{children}</div>
);

export default function AuditoriaProtocolos() {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const { hoja, cargando, error, buscar, refrescar } = useHojaRuta(token);
    const [examenAbierto, setExamenAbierto] = useState(null);

    const progreso = useMemo(() => resumirExamenes(hoja?.areas.flatMap((area) => area.examenes) ?? []), [hoja]);

    // Al cerrar el formulario se vuelve a consultar la orden para que el pad refleje si el examen ya se realizó
    const cerrarExamen = () => {
        setExamenAbierto(null);
        refrescar(hoja.orden);
    };

    return (
        <div className="mx-auto w-full overflow-hidden">
            <div className="rounded-lg bg-white py-8 shadow-md">
                <div className="mx-auto mb-4 flex w-full max-w-[95%] items-center">
                    <button
                        className="rounded border border-gray-300 bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-300"
                        onClick={() => navigate("/panel-de-control")}
                    >
                        ← Atrás
                    </button>
                </div>
                <h2 className="mb-4 text-center text-2xl font-bold text-[#233245]">Auditoría de Protocolos</h2>

                <div className="mx-auto max-w-[95%] space-y-4 px-4">
                    <SectionFieldset legend="Buscar orden" className="space-y-4">
                        <BuscadorOrden onBuscar={buscar} cargando={cargando} />
                    </SectionFieldset>

                    {cargando && <Aviso>Buscando orden...</Aviso>}
                    {error && <Aviso className="border-red-400 bg-red-50 text-red-700">{error}</Aviso>}
                    {!hoja && !cargando && !error && (
                        <Aviso>Ingresa un número de orden para ver los exámenes que debe pasar el paciente.</Aviso>
                    )}

                    {hoja && (
                        <>
                            <DatosOrden hoja={hoja} />
                            <ResumenProgreso {...progreso} />
                            {hoja.areas.map((area) => (
                                <AreaExamenes key={area.id} area={area} onSeleccionar={setExamenAbierto} />
                            ))}
                        </>
                    )}
                </div>

                {examenAbierto && <ModalExamen examen={examenAbierto} orden={hoja.orden} onClose={cerrarExamen} />}
            </div>
        </div>
    );
}
