import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faLocationDot, faPlus, faSitemap, faUser, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { ObtenerInventarios } from "./controllerInventarios";
import ModalRegistrarInventario from "./ModalRegistrarInventario/ModalRegistrarInventario";

// Sede de la sesión actual (misma fuente que el selector de sede del Navbar), en mayúsculas como la
// guarda el backend.
const nombreSedeActual = (userCompleto, selectedSede) =>
    String(userCompleto?.sedes?.find((sede) => String(sede.cod_sede) === String(selectedSede))?.nombre_sede ?? "").toUpperCase();

// Color del icono de cada inventario, por orden (el primero celeste, el segundo violeta, ...). Las
// clases van completas porque Tailwind solo genera las que aparecen literales en el código.
const COLORES_ICONO = [
    { icono: "bg-sky-100 text-sky-600", borde: "border-t-sky-500" },
    { icono: "bg-violet-100 text-violet-600", borde: "border-t-violet-500" },
    { icono: "bg-emerald-100 text-emerald-600", borde: "border-t-emerald-500" },
    { icono: "bg-amber-100 text-amber-600", borde: "border-t-amber-500" },
    { icono: "bg-rose-100 text-rose-600", borde: "border-t-rose-500" },
    { icono: "bg-indigo-100 text-indigo-600", borde: "border-t-indigo-500" },
    { icono: "bg-teal-100 text-teal-600", borde: "border-t-teal-500" },
    { icono: "bg-orange-100 text-orange-600", borde: "border-t-orange-500" },
    { icono: "bg-fuchsia-100 text-fuchsia-600", borde: "border-t-fuchsia-500" },
    { icono: "bg-lime-100 text-lime-600", borde: "border-t-lime-500" },
];

function DatoCard({ icono, children }) {
    return (
        <li className="flex items-start gap-2">
            <FontAwesomeIcon icon={icono} className="w-4 mt-0.5 text-gray-400 shrink-0" />
            <span className="min-w-0 break-words">{children}</span>
        </li>
    );
}

function CardInventario({ inventario, color }) {
    return (
        <article
            className={`bg-white rounded-lg border border-gray-200 border-t-4 ${color.borde} shadow-sm p-4 flex flex-col gap-3 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${color.icono}`}>
                    <FontAwesomeIcon icon={faWarehouse} />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-primario truncate" title={inventario.nombre}>{inventario.nombre}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primarioClaro text-primario">{inventario.tipo}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${inventario.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                            {inventario.activo ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                </div>
            </div>

            <ul className="text-sm text-gray-600 space-y-1.5">
                <DatoCard icono={faLocationDot}>{inventario.sede || "—"}</DatoCard>
                {inventario.inventarioPadreNombre && <DatoCard icono={faSitemap}>Depende de: {inventario.inventarioPadreNombre}</DatoCard>}
                <DatoCard icono={faUser}>{inventario.usuarioRegistro || "—"}</DatoCard>
                <DatoCard icono={faCalendarDays}>{formatearFechaHora(inventario.fechaRegistro)}</DatoCard>
            </ul>
        </article>
    );
}

export default function Inventarios() {
    const { token, userlogued, userCompleto, selectedSede } = useSessionData();

    const sedeActual = nombreSedeActual(userCompleto, selectedSede);

    const [inventarios, setInventarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState("");
    const [modalRegistro, setModalRegistro] = useState(false);

    const opcionesSede = useMemo(
        () => (userCompleto?.sedes ?? []).map((sede) => ({ value: String(sede.nombre_sede).toUpperCase(), label: sede.nombre_sede })),
        [userCompleto]
    );

    const cargar = async () => {
        setCargando(true);
        await ObtenerInventarios(token, setInventarios, setErrorCarga);
        setCargando(false);
    };

    useEffect(() => {
        cargar();
    }, []);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Inventarios Registrados">
                <div className="flex justify-end mb-3">
                    <button
                        type="button"
                        onClick={() => setModalRegistro(true)}
                        className="
                            bg-emerald-600 hover:bg-emerald-700
                            text-white text-base px-6 py-2 rounded
                            flex items-center gap-2
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Agregar nuevo
                    </button>
                </div>

                {errorCarga && (
                    <div className="flex items-center justify-between gap-4 mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{errorCarga}</span>
                        <button
                            type="button"
                            onClick={cargar}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {inventarios.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                        {cargando ? "Cargando inventarios..." : "No hay inventarios registrados"}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {inventarios.map((inventario, indice) => (
                            <CardInventario
                                key={inventario.id ?? inventario.nombre}
                                inventario={inventario}
                                color={COLORES_ICONO[indice % COLORES_ICONO.length]}
                            />
                        ))}
                    </div>
                )}
            </SectionFieldset>

            <ModalRegistrarInventario
                isOpen={modalRegistro}
                onRequestClose={() => setModalRegistro(false)}
                inventarios={inventarios}
                opcionesSede={opcionesSede}
                sedeActual={sedeActual}
                token={token}
                usuario={userlogued}
                onSuccess={cargar}
            />
        </div>
    );
}
