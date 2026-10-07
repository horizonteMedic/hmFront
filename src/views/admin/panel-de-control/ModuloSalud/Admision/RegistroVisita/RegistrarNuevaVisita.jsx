import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import CampaniaActivaBanner from "../../components/CampaniaActivaBanner";
import EstadoVisitaPill from "../../components/EstadoVisitaPill";
import ModalBase from "../../components/ModalBase";
import { buscarPaciente, buscarVisitasPrevias } from "./controllerRegistroVisita";

const FORM_ID = "form-buscar-paciente";
const BUSQUEDA_INICIAL = { dni: "", nombresCompletos: "" };

const Campo = (props) => <InputTextOneLine labelOnTop {...props} />;

// Visitas que el paciente ya tiene. La búsqueda trae las de todas las campañas, así que se indica cuáles
// son de la campaña activa (el N° de orden solo es único dentro de su campaña). `idsCampania` es null
// mientras no se conoce la lista de la campaña.
function VisitasPrevias({ visitas, idsCampania }) {
    if (!visitas.length) return <p className="text-sm text-gray-500">Este paciente no tiene visitas anteriores.</p>;

    return (
        <div>
            <p className="mb-1 text-sm font-semibold">Visitas anteriores ({visitas.length})</p>
            <ul className="divide-y rounded-lg border bg-white text-sm">
                {visitas.map((visita) => {
                    const enEstaCampania = idsCampania?.has(visita.visitaId);
                    return (
                        <li key={visita.visitaId} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
                            <span className="font-bold">N° {visita.norden}</span>
                            {idsCampania && (
                                <span
                                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                        enEstaCampania ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {enEstaCampania ? "Esta campaña" : "Otra campaña"}
                                </span>
                            )}
                            <EstadoVisitaPill estado={visita.estado} />
                            <span className="text-gray-500">{formatearFechaCorta(visita.fechaVisita)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// `bloqueo` es el motivo por el que aún no se puede registrar (null = se puede). `onRegistrar(paciente)`
// devuelve true si la visita se creó (entonces quien lo abrió cierra el modal).
export default function RegistrarNuevaVisita({ token, campania, especialidades, bloqueo, idsCampania, onClose, onRegistrar }) {
    const [busqueda, setBusqueda] = useState(BUSQUEDA_INICIAL);
    const [resultado, setResultado] = useState(null); // { paciente, visitasPrevias } de la última búsqueda con éxito
    const [registrando, setRegistrando] = useState(false);

    // Los campos son excluyentes: escribir en uno limpia el otro
    const handleChange = ({ target: { name, value } }) => setBusqueda({ ...BUSQUEDA_INICIAL, [name]: value.toUpperCase() });

    const buscar = async (e) => {
        e.preventDefault();
        if (!busqueda.dni && !busqueda.nombresCompletos) {
            return Swal.fire("Atención", "Ingrese un DNI o nombres completos para buscar", "warning");
        }

        LoadingDefault("Buscando...");
        try {
            const paciente = await buscarPaciente({ dni: busqueda.dni, nombres: busqueda.nombresCompletos }, token);
            if (!paciente) {
                setResultado(null);
                return Swal.fire("No encontrado", "No se encontró un paciente con esos datos", "warning");
            }

            const visitasPrevias = await buscarVisitasPrevias(paciente.numeroDocumento, token);
            setResultado({
                paciente: {
                    pacienteId: paciente.id,
                    dni: paciente.numeroDocumento,
                    nombres: `${paciente.nombres} ${paciente.apellidos}`,
                },
                visitasPrevias,
            });
            Swal.close();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        }
    };

    const registrar = async () => {
        setRegistrando(true);
        const creada = await onRegistrar(resultado.paciente);
        if (!creada) setRegistrando(false);
    };

    return (
        <ModalBase
            title="Registrar nueva visita"
            onClose={onClose}
            maxWidth="max-w-2xl"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={registrar}
                        disabled={!resultado || Boolean(bloqueo) || registrando}
                        className="flex items-center gap-2 rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        {registrando ? "Registrando..." : "Registrar visita"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <CampaniaActivaBanner campania={campania} />

                {bloqueo && (
                    <p className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">{bloqueo}</p>
                )}

                <form id={FORM_ID} onSubmit={buscar} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Campo label="DNI" name="dni" value={busqueda.dni} onChange={handleChange} />
                    <Campo label="Nombres completos" name="nombresCompletos" value={busqueda.nombresCompletos} onChange={handleChange} />
                    <div className="flex justify-end sm:col-span-2">
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            <FontAwesomeIcon icon={faSearch} /> Buscar
                        </button>
                    </div>
                </form>

                {resultado && (
                    <div className="space-y-3 border-t pt-4">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Paciente</p>
                            <p className="font-bold text-primario">{resultado.paciente.nombres}</p>
                            <p className="text-sm text-gray-600">DNI: {resultado.paciente.dni || "Sin documento"}</p>
                        </div>

                        <VisitasPrevias visitas={resultado.visitasPrevias} idsCampania={idsCampania} />

                        {especialidades.length > 0 && (
                            <div>
                                <p className="mb-1 text-sm font-semibold">Especialidades que se asignarán ({especialidades.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {especialidades.map((especialidad) => (
                                        <span
                                            key={especialidad.id}
                                            className="rounded-full bg-primarioClaro px-3 py-1 text-xs font-semibold text-primario"
                                        >
                                            {especialidad.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ModalBase>
    );
}
