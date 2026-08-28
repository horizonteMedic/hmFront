import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { useSessionData } from "../../../../../hooks/useSessionData";

const TIPOS_RELACION = [
    "PADRE", "MADRE", "HIJO", "HIJA",
    "HERMANO", "HERMANA", "TIO", "TIA",
    "ABUELO", "ABUELA", "ESPOSO", "ESPOSA",
    "PRIMO", "PRIMA", "TUTOR", "OTRO",
];

const URL_BUSCADOR   = "/api/pacientes/buscador";
const URL_PARENTESCO = "/api/v01/ct/pacienteParentesco/registrar";

function PacienteSelector({ label, seleccionado, onSeleccionar, token }) {
    const [texto, setTexto] = useState("");
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);

    const buscar = async () => {
        if (!texto.trim()) return;
        setBuscando(true);
        try {
            const res = await getFetch(`${URL_BUSCADOR}?texto=${encodeURIComponent(texto.trim())}`, token);
            const lista = Array.isArray(res) ? res : (res?.resultado ?? []);
            if (lista.length === 0) {
                Swal.fire("Sin resultados", `No se encontró ningún paciente con "${texto}"`, "info");
            }
            setResultados(lista);
        } catch {
            Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        } finally {
            setBuscando(false);
        }
    };

    const handleKeyUp = (e) => { if (e.key === "Enter") buscar(); };

    const limpiar = () => {
        onSeleccionar(null);
        setTexto("");
        setResultados([]);
    };

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-2">
            <p className="font-semibold text-sm text-gray-700">{label}</p>

            {/* Paciente seleccionado */}
            {seleccionado ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-300 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <FontAwesomeIcon icon={faUser} className="text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-blue-800 truncate">
                                {seleccionado.nombres} {seleccionado.apellidos}
                            </p>
                            <p className="text-xs text-blue-600">DNI: {seleccionado.dni ?? seleccionado.numeroDocumento}</p>
                        </div>
                    </div>
                    <button onClick={limpiar} className="text-blue-400 hover:text-red-500 ml-2 flex-shrink-0">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            ) : (
                <>
                    {/* Búsqueda */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={texto}
                            onChange={(e) => setTexto(e.target.value.toUpperCase())}
                            onKeyUp={handleKeyUp}
                            placeholder="DNI o nombre..."
                            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <button
                            onClick={buscar}
                            disabled={buscando}
                            className="azul-btn px-3 py-1.5 rounded text-sm flex items-center gap-1 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                    {/* Resultados */}
                    {resultados.length > 0 && (
                        <ul className="border border-gray-200 rounded max-h-40 overflow-y-auto divide-y divide-gray-100">
                            {resultados.map((p) => (
                                <li
                                    key={p.id}
                                    onClick={() => { onSeleccionar(p); setResultados([]); setTexto(""); }}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                >
                                    <span className="font-medium">{p.nombres} {p.apellidos}</span>
                                    <span className="text-gray-500 ml-2 text-xs">DNI: {p.dni ?? p.numeroDocumento}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default function RegistroParentesco({ onClose }) {
    const { token, userlogued } = useSessionData();
    const [origen,     setOrigen]     = useState(null);
    const [relacionado, setRelacionado] = useState(null);
    const [tipoRelacion, setTipoRelacion] = useState("");
    const [guardando, setGuardando] = useState(false);

    const handleSubmit = async () => {
        if (!origen)       return Swal.fire("Incompleto", "Selecciona el primer paciente", "warning");
        if (!relacionado)  return Swal.fire("Incompleto", "Selecciona el segundo paciente", "warning");
        if (!tipoRelacion) return Swal.fire("Incompleto", "Selecciona el tipo de relación", "warning");
        if (origen.id === relacionado.id)
            return Swal.fire("Error", "No puedes vincular a un paciente consigo mismo", "error");

        setGuardando(true);
        try {
            const body = {
                pacienteOrigenId:     origen.id,
                pacienteRelacionadoId: relacionado.id,
                tipoRelacion,
                usuarioRegistro: userlogued,
            };

            const res = await SubmitData(body, URL_PARENTESCO, token);

            // SubmitData devuelve Response object si hay error HTTP
            if (res && typeof res.json === "function") {
                const error = await res.json();
                Swal.fire("Error", error.mensaje ?? "No se pudo registrar el parentesco", "error");
                return;
            }

            await Swal.fire(
                "Registrado",
                `${origen.nombres} ${origen.apellidos} vinculado/a como ${tipoRelacion} de ${relacionado.nombres} ${relacionado.apellidos}`,
                "success"
            );
            onClose();
        } catch {
            Swal.fire("Error", "Ocurrió un error al registrar el parentesco", "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6 flex flex-col gap-4">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-lg font-semibold">Registrar Parentesco</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} style={{ fontSize: 16 }} />
                    </button>
                </div>

                {/* Selectores de pacientes */}
                <div className="flex gap-4 items-start">
                    <PacienteSelector
                        label="Paciente origen"
                        seleccionado={origen}
                        onSeleccionar={setOrigen}
                        token={token}
                    />

                    {/* Flecha central con tipo de relación */}
                    <div className="flex flex-col items-center gap-1 pt-6 flex-shrink-0">
                        <div className="text-gray-400 text-xl">→</div>
                    </div>

                    <PacienteSelector
                        label="Paciente relacionado"
                        seleccionado={relacionado}
                        onSeleccionar={setRelacionado}
                        token={token}
                    />
                </div>

                {/* Tipo de relación */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Tipo de relación</label>
                    <select
                        value={tipoRelacion}
                        onChange={(e) => setTipoRelacion(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    >
                        <option value="">-- Selecciona --</option>
                        {TIPOS_RELACION.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Resumen */}
                {origen && relacionado && tipoRelacion && (
                    <div className="bg-green-50 border border-green-200 rounded px-4 py-2 text-sm text-green-800">
                        <span className="font-semibold">{origen.nombres} {origen.apellidos}</span>
                        {" es "}<span className="font-semibold">{tipoRelacion}</span>{" de "}
                        <span className="font-semibold">{relacionado.nombres} {relacionado.apellidos}</span>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={guardando}
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        {guardando ? "Guardando..." : "Registrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
