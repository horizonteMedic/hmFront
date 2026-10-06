import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useAuthStore } from "../../../../../store/auth";
import BuscadorTexto from "../components/BuscadorTexto";
import CampaniaActivaBanner from "../components/CampaniaActivaBanner";
import { filtrarPorTexto } from "../utils/filtrarPorTexto";
import CampaniaCard from "./CampaniaCard";
import ModalRegistroCampania from "./ModalRegistroCampania";
import useCampaniaActiva from "../utils/useCampaniaActiva";
import useCampanias from "./useCampanias";
import { toCampaniaActiva } from "./controllerCampanias";

const confirmar = async (opciones) => {
    const { isConfirmed } = await Swal.fire({
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        ...opciones,
    });
    return isConfirmed;
};

const textoVacio = ({ cargando, fallo, busqueda }) => {
    if (cargando) return "Cargando campañas...";
    if (fallo) return "No se pudo cargar la lista de campañas.";
    if (busqueda.trim()) return "Ninguna campaña coincide con la búsqueda.";
    return "Aún no hay campañas registradas. Crea la primera con «Nueva campaña».";
};

export default function Campanias() {
    const token = useAuthStore((state) => state.token);
    const usuario = useAuthStore((state) => state.userlogued?.sub ?? "");
    const { campania: campaniaActiva, setCampania } = useCampaniaActiva();
    const { campanias, cargando, fallo, recargar } = useCampanias(token);
    const [busqueda, setBusqueda] = useState("");
    const [modal, setModal] = useState(false);

    const visibles = useMemo(
        () => filtrarPorTexto(campanias, busqueda, (c) => [c.codigo, c.nombre, c.empresa]),
        [campanias, busqueda]
    );

    const handleToggle = async (campania) => {
        if (campaniaActiva?.id === campania.id) {
            const ok = await confirmar({
                icon: "warning",
                title: "¿Desactivar campaña?",
                text: `"${campania.nombre}" dejará de ser la campaña activa.`,
                confirmButtonText: "Sí, desactivar",
            });
            if (ok) setCampania(null);
            return;
        }

        if (campaniaActiva) {
            const ok = await confirmar({
                title: "Cambiar campaña activa",
                text: `La campaña activa es "${campaniaActiva.nombre}". ¿Deseas cambiarla por "${campania.nombre}"?`,
                confirmButtonText: "Sí, cambiar",
            });
            if (!ok) return;
        }
        setCampania(toCampaniaActiva(campania));
    };

    return (
        <div className="mx-auto max-w-[95%] space-y-4 px-4">
            <SectionFieldset legend="Campañas" className="space-y-4">
                <CampaniaActivaBanner
                    campania={campaniaActiva}
                    hint="No hay ninguna campaña activa. Activa una de la lista para usarla en el sistema."
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <BuscadorTexto
                        value={busqueda}
                        onChange={setBusqueda}
                        placeholder="Buscar por código, nombre o empresa"
                        className="sm:max-w-md"
                    />
                    <button
                        type="button"
                        onClick={() => setModal(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Nueva campaña
                    </button>
                </div>

                {visibles.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibles.map((campania) => (
                            <CampaniaCard
                                key={campania.id}
                                campania={campania}
                                activa={campaniaActiva?.id === campania.id}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-400 py-10 text-center text-gray-600">
                        <p>{textoVacio({ cargando, fallo, busqueda })}</p>
                        {fallo && (
                            <button
                                type="button"
                                onClick={recargar}
                                className="mt-3 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Reintentar
                            </button>
                        )}
                    </div>
                )}
            </SectionFieldset>

            {modal && (
                <ModalRegistroCampania
                    token={token}
                    usuario={usuario}
                    onClose={() => setModal(false)}
                    onGuardado={recargar}
                />
            )}
        </div>
    );
}
