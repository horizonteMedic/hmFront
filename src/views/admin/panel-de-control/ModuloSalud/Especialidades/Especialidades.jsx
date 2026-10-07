import { useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { useAuthStore } from "../../../../../store/auth";
import BuscadorTexto from "../components/BuscadorTexto";
import Interruptor from "../components/Interruptor";
import SeccionDeCampania from "../components/SeccionDeCampania";
import { mensajeDeError } from "../utils/apiSalud";
import { filtrarPorTexto, normalizar } from "../utils/filtrarPorTexto";
import { cambiarEstadoEspecialidad, crearEspecialidad } from "./controllerEspecialidades";
import useEspecialidades from "./useEspecialidades";

const textoVacio = ({ cargando, fallo, total, busqueda }) => {
    if (cargando) return "Cargando especialidades...";
    if (fallo) return "No se pudo cargar la lista de especialidades.";
    if (total === 0) return "Esta campaña aún no tiene especialidades. Agrega la primera con el campo de arriba.";
    return busqueda.trim() ? "Ninguna especialidad coincide con la búsqueda." : "No hay especialidades.";
};

function EspecialidadesDeCampania({ campania }) {
    const token = useAuthStore((state) => state.token);
    const { especialidades, cargando, fallo, recargar } = useEspecialidades(token, campania);
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");
    const [agregando, setAgregando] = useState(false);
    const [cambiandoId, setCambiandoId] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const campoNombre = useRef(null);

    const visibles = useMemo(() => filtrarPorTexto(especialidades, busqueda, (e) => [e.nombre]), [especialidades, busqueda]);
    const activas = especialidades.filter((e) => e.activo).length;

    const agregar = async (e) => {
        e.preventDefault();
        const limpio = nombre.trim().replace(/\s+/g, " ");
        if (!limpio) return setError("Escribe el nombre de la especialidad");
        if (especialidades.some((s) => normalizar(s.nombre) === normalizar(limpio))) {
            return setError(`Ya existe "${limpio}" en esta campaña`);
        }

        setAgregando(true);
        try {
            await crearEspecialidad(limpio, campania.id, token);
            setNombre("");
            setError("");
            await recargar();
            campoNombre.current?.focus(); // para cargar varias seguidas sin volver a hacer clic
        } catch (err) {
            console.error(err);
            setError(mensajeDeError(err, "No se pudo registrar la especialidad"));
        } finally {
            setAgregando(false);
        }
    };

    const cambiarEstado = async (especialidad, activar) => {
        if (!activar) {
            const { isConfirmed } = await Swal.fire({
                icon: "question",
                title: "¿Desactivar especialidad?",
                text: `"${especialidad.nombre}" dejará de asignarse a las visitas nuevas de esta campaña.`,
                showCancelButton: true,
                confirmButtonText: "Sí, desactivar",
                cancelButtonText: "Cancelar",
            });
            if (!isConfirmed) return;
        }

        setCambiandoId(especialidad.id);
        try {
            await cambiarEstadoEspecialidad(especialidad.id, activar, token);
            await recargar();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", mensajeDeError(err, "No se pudo actualizar la especialidad"), "error");
        } finally {
            setCambiandoId(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-[95%] px-4">
            <SectionFieldset legend="Especialidades de la campaña" className="space-y-4">
                <form onSubmit={agregar} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="flex-1">
                        <input
                            ref={campoNombre}
                            type="text"
                            value={nombre}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                setError("");
                            }}
                            placeholder="Nombre de la nueva especialidad (ej. Medicina General)"
                            aria-label="Nombre de la nueva especialidad"
                            aria-invalid={Boolean(error)}
                            className={`w-full rounded-lg border bg-white px-3 py-2 focus:outline-none ${
                                error ? "border-red-500" : "border-gray-300 focus:border-primario"
                            }`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={agregando}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faPlus} /> {agregando ? "Agregando..." : "Agregar"}
                    </button>
                </form>

                {especialidades.length > 0 && activas === 0 && (
                    <p className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                        Ninguna especialidad está activa: mientras tanto no se podrán registrar visitas en esta campaña.
                    </p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <BuscadorTexto
                        value={busqueda}
                        onChange={setBusqueda}
                        placeholder="Buscar especialidad"
                        className="sm:max-w-md"
                    />
                    <p className="text-sm text-gray-600">
                        {activas} activa{activas === 1 ? "" : "s"} de {especialidades.length}
                    </p>
                </div>

                {visibles.length ? (
                    <ul className="divide-y overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {visibles.map((especialidad) => (
                            <li key={especialidad.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                <span className={`break-words ${especialidad.activo ? "font-semibold text-primario" : "text-gray-400"}`}>
                                    {especialidad.nombre}
                                </span>
                                <div className="flex flex-shrink-0 items-center gap-3">
                                    <span className={`text-xs font-semibold ${especialidad.activo ? "text-green-700" : "text-gray-400"}`}>
                                        {especialidad.activo ? "Activa" : "Inactiva"}
                                    </span>
                                    <Interruptor
                                        activo={especialidad.activo}
                                        etiqueta={`${especialidad.activo ? "Desactivar" : "Activar"} ${especialidad.nombre}`}
                                        disabled={cambiandoId === especialidad.id}
                                        onChange={(activar) => cambiarEstado(especialidad, activar)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-400 py-10 text-center text-gray-600">
                        <p>{textoVacio({ cargando, fallo, total: especialidades.length, busqueda })}</p>
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
        </div>
    );
}

export default function Especialidades({ onIrACampanias }) {
    return (
        <SeccionDeCampania
            mensaje="Las especialidades pertenecen a una campaña: cada campaña tiene las suyas."
            onIrACampanias={onIrACampanias}
        >
            {(campania) => <EspecialidadesDeCampania campania={campania} />}
        </SeccionDeCampania>
    );
}
