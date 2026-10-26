import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import EncabezadoPantalla from "./components/EncabezadoPantalla";
import LeyendaPantalla from "./components/LeyendaPantalla";
import TablaPacientes from "./components/TablaPacientes";
import { PACIENTES_MOCK } from "./config/pacientesMock";
import { useEscalaEscenario } from "./hooks/useEscalaEscenario";
import { usePacientesPantalla } from "./hooks/usePacientesPantalla";
import { usePaginaRotativa } from "./hooks/usePaginaRotativa";
import { usePantallaCompleta } from "./hooks/usePantallaCompleta";
import { armarColumnas } from "./utils/columnasExamenes";

// Escena de diseño fija (Full HD). Se escala para llenar cualquier TV/monitor.
const ANCHO_ESCENA = 1920;
const ALTO_ESCENA = 1080;
// Filas altas para que quepa el detalle de lo pendiente de cada área.
const PACIENTES_POR_PAGINA = 14;

const MensajeCentral = ({ children }) => (
    <div className="flex flex-1 items-center justify-center text-[40px] font-semibold text-white/90">
        {children}
    </div>
);

const PantallaPacientes = () => {
    const token = useAuthStore((state) => state.token);
    // `?demo` muestra datos de prueba para revisar el diseño sin backend.
    const [params] = useSearchParams();
    const esDemo = params.has("demo");

    const datos = usePacientesPantalla({ token, habilitado: !esDemo });
    const pacientes = esDemo ? PACIENTES_MOCK : datos.pacientes;
    const cargando = !esDemo && datos.cargando;
    const error = esDemo ? null : datos.error;

    const columnas = useMemo(() => armarColumnas(pacientes), [pacientes]);
    const { visibles, pagina, totalPaginas } = usePaginaRotativa(pacientes, PACIENTES_POR_PAGINA);
    const escala = useEscalaEscenario(ANCHO_ESCENA, ALTO_ESCENA);
    const { esPantallaCompleta, alternar } = usePantallaCompleta();
    console.log(datos)
    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#0a2f57]">
            <div
                className="absolute left-1/2 top-1/2 flex flex-col bg-gradient-to-b from-[#0e4d8c] to-[#0a2f57] font-sans"
                style={{
                    width: ANCHO_ESCENA,
                    height: ALTO_ESCENA,
                    transform: `translate(-50%, -50%) scale(${escala})`,
                }}
            >
                <EncabezadoPantalla
                    esPantallaCompleta={esPantallaCompleta}
                    onAlternarPantallaCompleta={alternar}
                />

                {cargando ? (
                    <MensajeCentral>Cargando pacientes…</MensajeCentral>
                ) : visibles.length === 0 ? (
                    <MensajeCentral>
                        {error ? "No se pudo cargar la información" : "No hay pacientes en atención"}
                    </MensajeCentral>
                ) : (
                    <TablaPacientes
                        pacientes={visibles}
                        columnas={columnas}
                        filas={PACIENTES_POR_PAGINA}
                    />
                )}

                <LeyendaPantalla
                    totalPacientes={pacientes.length}
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    error={error}
                />
            </div>
        </div>
    );
};

export default PantallaPacientes;
