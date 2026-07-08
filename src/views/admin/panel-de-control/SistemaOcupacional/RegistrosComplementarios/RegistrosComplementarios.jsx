import { useState } from "react";
import InputTextOneLine from "../../../../components/reusableComponents/InputTextOneLine"
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset"
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales"
import { useForm } from "../../../../hooks/useForm";
import { useSessionData } from "../../../../hooks/useSessionData";
import { GetInfoPac, RegistrarEstadoExamen } from "./controllerRegistrosComplementarios";

const EXAMENES = [
    { label: "Toma de Muestras", key: "toma_muestras", icon: "🧪" },
    { label: "Examen Médico", key: "examen_medico", icon: "🩺" },
    { label: "Radiografía", key: "comp_radiografia", icon: "🦴" },
    { label: "EKG", key: "comp_ekg", icon: "❤️" },
];

const ExamenCard = ({ examen, norden, estado, onToggle, loading }) => {
    const existe = estado === true;
    const sinOrden = !norden;

    return (
        <div
            className={`relative rounded-xl border-2 p-4 flex flex-col gap-3 transition-all duration-200 shadow-sm
                ${sinOrden
                    ? "border-gray-200 bg-gray-50"
                    : existe
                        ? "border-green-400 bg-green-50"
                        : "border-red-300 bg-red-50"
                }`}
        >
            {/* Indicador de estado */}
            <div className="flex items-center justify-between">
                <span className="text-xl">{examen.icon}</span>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${sinOrden
                            ? "bg-gray-200 text-gray-500"
                            : existe
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-700"
                        }`}
                >
                    {sinOrden ? "Sin orden" : existe ? "Registrado" : "Sin registro"}
                </span>
            </div>

            {/* Nombre del examen */}
            <div>
                <p className="text-sm font-bold text-gray-700">{examen.label}</p>
                <p className="text-xs text-gray-400 font-mono">{examen.key}</p>
            </div>

            {/* Botón */}
            <button
                type="button"
                disabled={sinOrden || loading}
                onClick={() => onToggle(examen.key, !existe)}
                className={`mt-auto w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all
                    ${sinOrden
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : loading
                            ? "opacity-60 cursor-wait"
                            : existe
                                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    }`}
            >
                {loading
                    ? "Procesando..."
                    : existe
                        ? "Eliminar registro"
                        : "Activar registro"
                }
            </button>
        </div>
    );
};

const RegistrosComplementarios = () => {
    const initialFormState = {
        norden: "",
        nombreExamen: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",
    };

    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const { form, setForm, handleChangeNumber, handleClear, handleClearnotO } = useForm(initialFormState);

    // estados[key] = true | false | null (null = no consultado aún)
    const [estados, setEstados] = useState({});
    const [loadingKey, setLoadingKey] = useState(null);
    const [fetchingEstados, setFetchingEstados] = useState(false);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            setEstados({});
            GetInfoPac(form.norden, setForm, token, selectedSede, setEstados);
        }
    };

    const handleToggle = async (nombreExamen, nuevoEstado) => {
        setLoadingKey(nombreExamen);
        try {
            const res = await RegistrarEstadoExamen(
                form.norden,
                nombreExamen,
                nuevoEstado,
                userlogued,
                token
            );
            if (res && !res.error) {
                setEstados((prev) => ({ ...prev, [nombreExamen]: nuevoEstado }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingKey(null);
        }
    };

    return (
        <div className="w-full space-y-3 px-4 max-w-[95%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Registros Complementarios">
                {fetchingEstados && (
                    <p className="text-sm text-gray-400 mb-3 animate-pulse">Consultando estados...</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {EXAMENES.map((examen) => (
                        <ExamenCard
                            key={examen.key}
                            examen={examen}
                            norden={form.norden}
                            estado={estados[examen.key] ?? null}
                            loading={loadingKey === examen.key}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </SectionFieldset>
        </div>
    );
};

export default RegistrosComplementarios;
