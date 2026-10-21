import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/auth";
import Aviso from "./components/Aviso";
import BuscadorOrden from "./components/BuscadorOrden";
import ListaExamenes from "./components/ListaExamenes";
import PacienteCard from "./components/PacienteCard";
import PanelExamen from "./components/PanelExamen";
import ResumenProgreso from "./components/ResumenProgreso";
import useHojaRuta from "./hooks/useHojaRuta";
import { resumirExamenes } from "./utils/progreso";

export default function AuditoriaProtocolos() {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const { hoja, cargando, error, buscar, refrescar } = useHojaRuta(token);
    // Se guarda solo la clave del examen abierto: el examen se toma siempre de la hoja, así su estado está al día
    const [claveAbierta, setClaveAbierta] = useState(null);

    const examenes = useMemo(() => hoja?.areas.flatMap((area) => area.examenes) ?? [], [hoja]);
    const progreso = useMemo(() => resumirExamenes(examenes), [examenes]);
    const examenAbierto = examenes.find((examen) => examen.clave === claveAbierta);

    const buscarOrden = (orden) => {
        setClaveAbierta(null);
        buscar(orden);
    };

    return (
        <div className="mx-auto w-full">
            <div className="rounded-lg bg-white py-6 shadow-md">
                <div className="mx-auto w-full max-w-[95%] space-y-4 px-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <button
                            className="rounded border border-gray-300 bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-300"
                            onClick={() => navigate("/panel-de-control")}
                        >
                            ← Atrás
                        </button>
                        <h2 className="text-2xl font-bold text-[#233245]">Auditoría de Protocolos</h2>
                    </div>

                    <BuscadorOrden onBuscar={buscarOrden} cargando={cargando} />

                    {cargando && <Aviso tipo="cargando">Buscando orden...</Aviso>}
                    {error && <Aviso tipo="error">{error}</Aviso>}
                    {!hoja && !cargando && !error && (
                        <Aviso>Ingresa un número de orden para ver los exámenes que debe pasar el paciente.</Aviso>
                    )}

                    {hoja && (
                        <div className="grid items-start gap-4 lg:grid-cols-[36rem_minmax(0,1fr)]">
                            <aside className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1">
                                <PacienteCard hoja={hoja} />
                                <ResumenProgreso {...progreso} />
                                <ListaExamenes
                                    areas={hoja.areas}
                                    seleccionada={claveAbierta}
                                    onSeleccionar={(examen) => setClaveAbierta(examen.clave)}
                                />
                            </aside>

                            <main className="min-w-0">
                                {examenAbierto ? (
                                    <PanelExamen
                                        key={`${hoja.orden}-${examenAbierto.clave}`}
                                        examen={examenAbierto}
                                        orden={hoja.orden}
                                        onGuardado={() => refrescar(hoja.orden)}
                                    />
                                ) : (
                                    <Aviso>Elige un examen de la barra lateral para ver o registrar sus resultados.</Aviso>
                                )}
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
