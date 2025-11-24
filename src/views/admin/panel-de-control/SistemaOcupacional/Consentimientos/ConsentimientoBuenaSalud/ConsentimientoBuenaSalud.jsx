import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import {
    PrintHojaR,
    SubmitDataService,
    VerifyTR,
} from "./controllerConsentimientoBuenaSalud";
import { getToday } from "../../../../../utils/helpers";
import useRealTime from "../../../../../hooks/useRealTime";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";

const tabla = "consentimientobuenasalud";
const today = getToday();

const initialFormState = {
    norden: "",
    fecha: today,
    nombres: "",
    edad: "",
    dni: "",
    textoFinalConsentimiento: `NO PADEZCO DE ENFERMEDAD ALGUNA, NI PRESENTO SÍNTOMAS DE NINGÚN TIPO, por lo cual me considero un persona completamente SANA.`,
};

export default function ConsentimientoBuenaSalud() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();
    const hora = useRealTime();

    const {
        form,
        setForm,
        handleChange,
        handleChangeSimple,
        handleChangeNumber,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "consentimientoBuenaSalud" });

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    return (
        <div className="w-[90%] mx-auto text-[11px] mt-12">
            {/* Título principal */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Consentimiento de Buena Salud
                </h1>
                <p className="text-center text-gray-600 text-md">
                    Sistema de Gestión de Consentimientos - HORIZONTE MEDIC
                </p>
            </div>

            {/* Búsqueda */}
            <SectionFieldset legend="Información del Examen" className="mb-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden || ""}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumber}
                    placeholder="Ingrese N° Orden"
                    labelWidth="120px"
                />
            </SectionFieldset>

            {/* Contenido del Consentimiento */}
            <SectionFieldset legend="Consentimiento de Buena Salud" className="space-y-4">
                {/* Información Personal */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[30px]">Yo:</label>
                        <InputTextOneLine
                            name="nombres"
                            value={form.nombres || ""}
                            disabled
                            placeholder="Nombre completo"
                            labelWidth="0px"
                            className="flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <label className="font-semibold min-w-[30px]">de</label>
                        <InputTextOneLine
                            name="edad"
                            value={form.edad || ""}
                            disabled
                            placeholder="Edad"
                            labelWidth="0px"
                            className="w-48"
                        />
                        <label className="font-semibold min-w-[50px]">años de edad,</label>
                        <label className="font-semibold min-w-[80px]">identificado con DNI:</label>
                        <InputTextOneLine
                            name="dni"
                            value={form.dni || ""}
                            disabled
                            placeholder="DNI"
                            labelWidth="0px"
                            className="w-48"
                        />
                    </div>
                </div>

                {/* Texto del Consentimiento */}
                <div className="space-y-4">
                    <div className="text-justify leading-relaxed">
                        <p className="mb-3">
                            {form.textoFinalConsentimiento}
                        </p>
                        <p className="text-justify leading-relaxed mt-3">
                            Por lo que soy responsable de lo anteriormente declarado.
                        </p>
                    </div>
                </div>

                {/* Fecha y Hora */}
                <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[60px]">Fecha:</label>
                        <InputTextOneLine
                            type="date"
                            name="fecha"
                            value={form.fecha}
                            onChange={handleChangeSimple}
                            labelWidth="0px"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-semibold min-w-[60px]">Hora:</label>
                        <input
                            type="text"
                            className="border rounded px-2 py-1"
                            name="hora"
                            value={hora}
                            disabled
                        />
                    </div>
                </div>
            </SectionFieldset>

            {/* Botones de Acción */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-2">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        Grabar/Actualizar
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBroom} /> Limpiar
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold italic text-base mb-1">Imprimir</span>
                    <div className="flex items-center gap-2">
                        <input
                            name="norden"
                            value={form.norden}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 text-base w-24"
                        />
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
