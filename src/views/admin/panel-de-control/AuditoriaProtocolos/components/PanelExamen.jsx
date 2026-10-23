import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faFilePdf, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../../../../store/auth";
import { formularioDe } from "../config/formulariosExamen";

const PANTALLA_ANGOSTA = "(max-width: 1023px)";

// Formulario del examen elegido para la orden buscada: ver o registrar sus resultados, o abrir su reporte.
// El formulario consulta sus propios datos al montarse, por eso solo se monta el examen abierto (carga bajo demanda).
// `onGuardado` avisa que se registró el examen, para que la barra lateral refleje el nuevo estado.
export default function PanelExamen({ examen, orden, onGuardado }) {
    const token = useAuthStore((state) => state.token);
    const datosFooter = useAuthStore((state) => state.datosFooter);
    const { titulo, Formulario, verReporte } = formularioDe(examen);
    const raiz = useRef(null);
    const [registrado, setRegistrado] = useState(false);
    // Cambia al volver a abrir el examen tras registrarlo, para que el formulario se monte de nuevo y recargue sus datos
    const [version, setVersion] = useState(0);

    // En pantallas angostas la barra queda encima del formulario: se baja hasta él al elegir un examen
    useEffect(() => {
        if (window.matchMedia(PANTALLA_ANGOSTA).matches) raiz.current?.scrollIntoView({ block: "start" });
    }, []);

    const handleGuardado = () => {
        setRegistrado(true);
        onGuardado();
    };

    return (
        <section ref={raiz} className="scroll-mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-gray-500">ORDEN {orden}</p>
                    <h3 className="break-words text-lg font-bold leading-tight text-primario">{titulo}</h3>
                </div>
                <button
                    type="button"
                    disabled={!examen.completado}
                    title={examen.completado ? undefined : "El examen aún no se realizó"}
                    onClick={() => verReporte(orden, token, datosFooter)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faFilePdf} /> Ver reporte
                </button>
            </header>

            {registrado ? (
                <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-green-600" />
                    <p className="font-semibold text-gray-800">{titulo} registrado correctamente</p>
                    <button
                        type="button"
                        onClick={() => {
                            setRegistrado(false);
                            setVersion((actual) => actual + 1);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <FontAwesomeIcon icon={faRotateRight} /> Ver datos registrados
                    </button>
                </div>
            ) : (
                <Formulario key={version} nOrdenInicial={orden} onGuardado={handleGuardado} />
            )}
        </section>
    );
}
