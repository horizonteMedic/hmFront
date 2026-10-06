import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import Ticket from "../../../../../jaspers/Ticket/Ticket";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { useAuthStore } from "../../../../../../store/auth";
import useCampaniaActiva from "../../utils/useCampaniaActiva";
import BuscadorTexto from "../../components/BuscadorTexto";
import CampaniaRequerida from "../../components/CampaniaRequerida";
import { mensajeDeError } from "../../utils/apiSalud";
import { filtrarPorTexto } from "../../utils/filtrarPorTexto";
import { crearVisita, getVisitaById } from "./controllerRegistroVisita";
import ModalReporte from "./ModalReporte";
import RegistrarNuevaVisita from "./RegistrarNuevaVisita";
import { REPORTES } from "./reportes";
import useEspecialidadesActivas from "./useEspecialidadesActivas";
import useRegistroAutomatico from "./useRegistroAutomatico";
import useVisitasCampania from "./useVisitasCampania";
import VisitasTabla from "./VisitasTabla";

const MENSAJE_CAMPANIA_REQUERIDA =
    "Las visitas se registran dentro de una campaña: su N° de orden y sus especialidades son propios de cada una.";

// Por qué todavía no se puede registrar una visita en la campaña (null = se puede)
const motivoBloqueo = (campania, { especialidades, cargando, fallo }) => {
    if (cargando) return "Cargando las especialidades de la campaña...";
    if (fallo) return "No se pudieron cargar las especialidades de la campaña.";
    if (!especialidades.length) {
        return `La campaña "${campania.nombre}" no tiene especialidades activas, por eso no se pueden registrar visitas. Agrégalas o actívalas en la sección «Especialidades».`;
    }
    return null;
};

const textoVacio = ({ cargando, fallo, busqueda }) => {
    if (cargando) return "Cargando visitas...";
    if (fallo) return "No se pudo cargar la lista de visitas. Usa «Actualizar» para reintentar.";
    if (busqueda.trim()) return "Ninguna visita coincide con la búsqueda.";
    return "Aún no hay visitas registradas en esta campaña.";
};

// Se usa cuando llega un paciente recién registrado y no hay campaña activa: su visita no se puede crear.
const avisarCampaniaRequerida = async (paciente, onIrACampanias) => {
    const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Primero activa una campaña",
        text: `El paciente "${paciente.nombres}" ya está registrado. Para crear su visita activa una campaña y luego búscalo con «Registrar nueva visita».`,
        showConfirmButton: Boolean(onIrACampanias),
        confirmButtonText: "Ir a Campañas",
        showCancelButton: true,
        cancelButtonText: onIrACampanias ? "Cerrar" : "Entendido",
    });
    if (isConfirmed) onIrACampanias?.();
};

export default function RegistroVisita({ pacienteActivo, onAutoRegistrado, onVisitaSeleccionada, onIrACampanias }) {
    const token = useAuthStore((state) => state.token);
    const usuario = useAuthStore((state) => state.userlogued?.sub ?? "");
    const { campania } = useCampaniaActiva();
    const { visitas, cargando, fallo, recargar } = useVisitasCampania(token, campania);
    const especialidades = useEspecialidadesActivas(token, campania);
    const [busqueda, setBusqueda] = useState("");
    const [modal, setModal] = useState(null); // "registrar" | clave de REPORTES | null

    const visibles = useMemo(
        () => filtrarPorTexto(visitas, busqueda, (v) => [v.norden, v.dni, v.nombres, v.apellidos]),
        [visitas, busqueda]
    );
    // Ids de las visitas de esta campaña (null mientras no se conocen), para distinguirlas de las de otras
    const idsCampania = useMemo(
        () => (cargando || fallo ? null : new Set(visitas.map((v) => v.visitaId))),
        [visitas, cargando, fallo]
    );
    const bloqueo = campania && motivoBloqueo(campania, especialidades);

    // ── Ticket ────────────────────────────────────────────────────────────────
    const imprimirTicket = async (visitaId) => {
        try {
            const datos = await getVisitaById(visitaId, token);
            await Ticket({ datos, titulo: campania.nombre, logoUrl: campania.fotoUrl });
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo generar el ticket de la visita", "error");
        }
    };

    const confirmarImpresion = async ({ norden, visitaId }) => {
        const { isConfirmed } = await Swal.fire({
            title: "Confirmar impresión",
            text: `¿Deseas imprimir el ticket N° ${norden}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, imprimir",
            cancelButtonText: "No",
        });
        if (isConfirmed) imprimirTicket(visitaId);
    };

    // ── Registro ──────────────────────────────────────────────────────────────
    // Crea la visita del paciente en la campaña activa con todas sus especialidades activas.
    // Devuelve true si se creó. Se usa desde el modal y desde el alta de paciente (auto-registro).
    const registrarVisita = async (paciente) => {
        if (!campania) {
            avisarCampaniaRequerida(paciente, onIrACampanias);
            return false;
        }
        if (bloqueo) {
            Swal.fire("No se puede registrar", bloqueo, "warning");
            return false;
        }

        LoadingDefault("Registrando visita...");
        try {
            const visita = await crearVisita(
                {
                    campaniaId: campania.id,
                    pacienteId: paciente.pacienteId,
                    especialidadIds: especialidades.especialidades.map((e) => e.id),
                    usuarioRegistro: usuario,
                },
                token
            );
            recargar();
            Swal.fire("Éxito", `Visita N° ${visita.norden} registrada en "${campania.nombre}"`, "success").then(() =>
                imprimirTicket(visita.id)
            );
            return true;
        } catch (error) {
            console.error(error);
            Swal.fire("Error", mensajeDeError(error, "No se pudo registrar la visita"), "error");
            return false;
        }
    };

    const handleRegistrarDesdeModal = async (paciente) => {
        const creada = await registrarVisita(paciente);
        if (creada) setModal(null);
        return creada;
    };

    // Paciente recién registrado: se le crea la visita en cuanto se conocen las especialidades de la campaña
    useRegistroAutomatico(pacienteActivo, !campania || !especialidades.cargando, registrarVisita, onAutoRegistrado);

    if (!campania) {
        return (
            <div className="mx-auto max-w-[95%] px-4">
                <CampaniaRequerida mensaje={MENSAJE_CAMPANIA_REQUERIDA} onIrACampanias={onIrACampanias} />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[95%] space-y-4 px-4">
            <SectionFieldset legend={`Visitas de la campaña (${visibles.length})`} className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2 lg:max-w-md lg:flex-1">
                        <BuscadorTexto
                            value={busqueda}
                            onChange={setBusqueda}
                            placeholder="Buscar por N° orden, DNI o nombre"
                        />
                        <button
                            type="button"
                            onClick={recargar}
                            disabled={cargando}
                            title="Actualizar lista"
                            aria-label="Actualizar lista de visitas"
                            className="flex-shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faRotateRight} spin={cargando} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(REPORTES).map(([clave, { etiqueta, icono }]) => (
                            <button
                                key={clave}
                                type="button"
                                onClick={() => setModal(clave)}
                                className="verde-btn flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold"
                            >
                                {etiqueta} <FontAwesomeIcon icon={icono} />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setModal("registrar")}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-blue-700"
                        >
                            <FontAwesomeIcon icon={faUserPlus} /> Registrar nueva visita
                        </button>
                    </div>
                </div>

                <VisitasTabla
                    visitas={visibles}
                    emptyText={textoVacio({ cargando, fallo, busqueda })}
                    onSeleccionar={(visita) => onVisitaSeleccionada?.(visita.visitaId)}
                    onImprimir={(visita) => imprimirTicket(visita.visitaId)}
                    onClickDerecho={confirmarImpresion}
                />
            </SectionFieldset>

            {modal === "registrar" && (
                <RegistrarNuevaVisita
                    token={token}
                    campania={campania}
                    especialidades={especialidades.especialidades}
                    bloqueo={bloqueo}
                    idsCampania={idsCampania}
                    onClose={() => setModal(null)}
                    onRegistrar={handleRegistrarDesdeModal}
                />
            )}
            {REPORTES[modal] && (
                <ModalReporte reporte={REPORTES[modal]} token={token} campania={campania} onClose={() => setModal(null)} />
            )}
        </div>
    );
}
