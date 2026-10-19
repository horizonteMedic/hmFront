import { memo, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheck, faFingerprint, faSignature, faX } from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import NewPad from "../../../../SistemaOcupacional/Admision/pad/Newpad";
import NewHuellaFut from "../../../../SistemaOcupacional/Admision/huella/HuellaFut";
import FotoPaciente from "../../../../SistemaOcupacional/Admision/foto/FotoPaciente";
import {
    ARCHIVOS_PACIENTE,
    SIN_ARCHIVO,
    consultarArchivoAsistencial,
    subirArchivoAsistencial,
} from "./controllerArchivosPaciente";

const BOTONES = [
    { key: "firma", label: "Tomar Firma", icon: faSignature, color: "bg-purple-600 hover:bg-purple-700" },
    { key: "huella", label: "Tomar Huella Futronic", icon: faFingerprint, color: "bg-teal-600 hover:bg-teal-700" },
    { key: "foto", label: "Tomar Fotografía", icon: faCamera, color: "bg-orange-500 hover:bg-orange-600" },
];

const SIN_ARCHIVOS = { firma: SIN_ARCHIVO, huella: SIN_ARCHIVO, foto: SIN_ARCHIVO };

const EstadoArchivo = ({ registrado }) => (
    <span className={`flex items-center gap-1.5 text-sm font-semibold ${registrado ? "text-green-600" : "text-red-500"}`}>
        <FontAwesomeIcon icon={registrado ? faCheck : faX} />
        {registrado ? "Registrado" : "Sin registrar"}
    </span>
);

// Firma, huella y foto del paciente asistencial. Se guardan por N° de Historia Clínica, así que
// los botones solo funcionan con un paciente ya registrado. Reutiliza los modales de captura de
// Admisión, apuntándolos a los endpoints asistenciales mediante su prop `subir`.
// Está memorizado porque el padre se re-renderiza cada segundo (reloj de useSessionData).
function ArchivosPaciente({ numeroHistoriaClinica, token }) {
    const [archivos, setArchivos] = useState(SIN_ARCHIVOS);
    const [modal, setModal] = useState(null); // null | "firma" | "huella" | "foto"
    // Estable a propósito: los modales reinician efectos (p. ej. consulta al lector Futronic) si `close` cambia.
    const cerrarModal = useCallback(() => setModal(null), []);

    // Al cambiar de paciente se consulta qué archivos tiene ya registrados.
    useEffect(() => {
        setArchivos(SIN_ARCHIVOS);
        if (!numeroHistoriaClinica) return;

        let vigente = true;
        Object.keys(ARCHIVOS_PACIENTE).forEach(async (key) => {
            const archivo = await consultarArchivoAsistencial(numeroHistoriaClinica, key, token);
            if (vigente) setArchivos((a) => ({ ...a, [key]: archivo }));
        });
        return () => {
            vigente = false;
        };
    }, [numeroHistoriaClinica, token]);

    const abrir = (key) => {
        if (!numeroHistoriaClinica) {
            return Swal.fire("Error", "Busque o registre al paciente: se necesita su N° de Historia Clínica", "error");
        }
        setModal(key);
    };

    const subir = (key) => (base64) => subirArchivoAsistencial({ numeroHistoriaClinica, key, base64 }, token);

    // Tras guardar se vuelve a consultar para tener la URL vigente (la usa el modal al reabrirse).
    const alGuardar = async (key) => {
        const archivo = await consultarArchivoAsistencial(numeroHistoriaClinica, key, token);
        setArchivos((a) => ({ ...a, [key]: archivo }));
    };

    return (
        <>
            <SectionFieldset legend="Firma, Huella y Fotografía" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {BOTONES.map(({ key, label, icon, color }) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                        <EstadoArchivo registrado={archivos[key].id === 1} />
                        <button
                            type="button"
                            onClick={() => abrir(key)}
                            className={`w-full max-w-64 px-6 py-2 text-base font-semibold rounded-xl text-white flex items-center gap-2 justify-center ${color}`}
                        >
                            <FontAwesomeIcon icon={icon} /> {label}
                        </button>
                    </div>
                ))}
            </SectionFieldset>

            {modal === "firma" && (
                <NewPad
                    close={cerrarModal}
                    Firma={archivos.firma}
                    setFirma={() => alGuardar("firma")}
                    subir={subir("firma")}
                />
            )}
            {modal === "huella" && (
                <NewHuellaFut
                    close={cerrarModal}
                    Huella={archivos.huella}
                    setHuella={() => alGuardar("huella")}
                    subir={subir("huella")}
                />
            )}
            {modal === "foto" && (
                <FotoPaciente
                    close={cerrarModal}
                    Foto={archivos.foto}
                    setFoto={() => alGuardar("foto")}
                    subir={subir("foto")}
                />
            )}
        </>
    );
}

const ArchivosPacienteMemo = memo(ArchivosPaciente);

export default ArchivosPacienteMemo;
