import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";

const tabla = ""
const today = getToday();
// Áreas de Evaluación: Inteligencia
const inteligenciaItems = [
    { name: "intelCoeficiente", label: "1. Coeficiente Intelectual" },
    { name: "intelComprension", label: "2. Comprensión" },
    { name: "intelAtencion", label: "3. Nivel de atención / Concentración" },
    { name: "intelMemoria", label: "4. Memoria a corto, mediano y largo plazo" },
    { name: "intelVisomotora", label: "5. Coordinación viso-motora" },
    { name: "intelOrientacionEspacial", label: "6. Orientación espacial" },
    { name: "intelDiscriminarDetalles", label: "7. Capacidad para discriminar detalles" },
    { name: "intelAprendizaje", label: "8. Capacidad de aprendizaje" },
    { name: "intelAnalisisSintesis", label: "9. Capacidad de análisis y síntesis" }
];
// Áreas de Evaluación: Personalidad
const personalidadItems = [
    { name: "persEstabilidad", label: "1. Estabilidad emocional" },
    { name: "persAfrontaEstres", label: "2. Afrontamiento al estrés" },
    { name: "persAfrontaRiesgo", label: "3. Afrontamiento al riesgo" },
    { name: "persRelaciones", label: "4. Relaciones interpersonales / Adaptación al medio" },
    { name: "persNormasReglas", label: "5. Disposición para acatar normas y reglas" },
];
// Opciones estandarizadas S / NPS / NP / NPI
const evalOptions = [
    { value: "S", label: "S" },
    { value: "NPS", label: "NPS" },
    { value: "NP", label: "NP" },
    { value: "NPI", label: "NPI" },
];

export default function EvaluacionPsicologicaPoderosa() {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExam: today,
        nombreExamen: "",
        tipoInforme: "",
        aptitud: "",

        // Datos personales
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        ocupacion: "",
        cargoDesempenar: "",
        empresa: "",
        contrata: "",

        // Áreas de Evaluación (Inteligencia)
        intelCoeficiente: "",
        intelComprension: "",
        intelAtencion: "",
        intelMemoria: "",
        intelVisomotora: "",
        intelOrientacionEspacial: "",
        intelDiscriminarDetalles: "",
        intelAprendizaje: "",
        intelAnalisisSintesis: "",

        // Áreas de Evaluación (Personalidad)
        persEstabilidad: "",
        persAfrontaEstres: "",
        persAfrontaRiesgo: "",
        persRelaciones: "",
        persNormasReglas: "",

        // Campos de texto libres
        fortalezasOportunidades: "",
        amenazasDebilidades: "",
        observaciones: "",
        recomendaciones: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleRadioButton,
    } = useForm(initialFormState, { storageKey: "EvaluacionPsicologicaPoderosa" });

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    return (
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                <div className="w-full space-y-3 px-4">
                    {/* Header */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form.norden}
                                onKeyUp={handleSearch}
                                onChange={handleChangeNumber}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Fecha Examen"
                                name="fechaExam"
                                type="date"
                                value={form.fechaExam}
                                onChange={handleChangeSimple}
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Nombre Examen"
                                name="nombreExamen"
                                value={form.nombreExamen}
                                disabled
                                labelWidth="120px"
                            />
                            <InputsRadioGroup
                                label="Tipo Informe"
                                name="tipoInforme"
                                value={form.tipoInforme}
                                labelWidth="120px"
                                options={[
                                    { label: "NORMAL", value: "NORMAL" },
                                    { label: "LICENCIA", value: "LICENCIA" },
                                    { label: "T. EN CALIENTE", value: "T. EN CALIENTE" },
                                ]}
                                onChange={handleRadioButton}
                            />
                            <InputsRadioGroup
                                label="Aptitud"
                                name="aptitud"
                                value={form.aptitud}
                                labelWidth="120px"
                                options={[
                                    { label: "APTO", value: "APTO" },
                                    { label: "NO APTO", value: "NO APTO" },
                                    { label: "EX", value: "EX" },
                                    { label: "AP O.", value: "AP O." },
                                ]}
                                onChange={handleRadioButton}
                            />
                        </div>
                    </div>

                    {/* Datos Necesarios */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
                        <legend className="font-bold mb-3 text-[10px]">Datos Personales</legend>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Izquierda */}
                            <div className="space-y-3">
                                <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="160px" />
                                <InputTextOneLine label="Apellidos" name="apellidos" value={form.apellidos} disabled labelWidth="160px" />
                                <InputTextOneLine label="Fecha Nacimiento" name="fechaNacimiento" value={form.fechaNacimiento} disabled labelWidth="160px" />
                                <InputTextOneLine label="Lugar Nacimiento" name="lugarNacimiento" value={form.lugarNacimiento} disabled labelWidth="160px" />
                            </div>
                            {/* Derecha */}
                            <div className="space-y-3">
                                <InputTextOneLine label="Domicilio Actual" name="domicilioActual" value={form.domicilioActual} disabled labelWidth="160px" />
                                <InputTextOneLine label="Edad (años)" name="edad" value={form.edad} disabled labelWidth="160px" />
                                <InputTextOneLine label="Estado Civil" name="estadoCivil" value={form.estadoCivil} disabled labelWidth="160px" />
                                <InputTextOneLine label="Nivel de Estudios" name="nivelEstudios" value={form.nivelEstudios} disabled labelWidth="160px" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Datos Laborales */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
                        <legend className="font-bold mb-3 text-[10px]">Datos Laborales</legend>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <InputTextOneLine label="Ocupación" name="ocupacion" value={form.ocupacion} disabled labelWidth="160px" />
                                <InputTextOneLine label="Cargo a desempeñar" name="cargoDesempenar" value={form.cargoDesempenar} disabled labelWidth="160px" />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine label="Empresa" name="empresa" value={form.empresa} disabled labelWidth="160px" />
                                <InputTextOneLine label="Contrata" name="contrata" value={form.contrata} disabled labelWidth="160px" />
                            </div>
                        </div>
                    </fieldset>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Áreas de Evaluación - Inteligencia */}
                        <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
                            <legend className="font-bold mb-3 text-[10px]">Áreas de Evaluación - Inteligencia</legend>
                            <RadioTable
                                items={inteligenciaItems}
                                options={evalOptions}
                                labelColumns={3}
                                form={form}
                                handleRadioButton={handleRadioButton}
                            />
                        </fieldset>
                        {/* Áreas de Evaluación - Personalidad */}
                        <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
                            <legend className="font-bold mb-3 text-[10px]">Áreas de Evaluación - Personalidad</legend>
                            <RadioTable
                                items={personalidadItems}
                                options={evalOptions}
                                form={form}
                                labelColumns={3}
                                handleRadioButton={handleRadioButton} />
                        </fieldset>
                    </div>
                    {/* Campos de texto libres */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-3">
                        <legend className="font-bold mb-3 text-[10px]">Conclusiones Finales</legend>
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputTextArea
                                label="Fortalezas y Oportunidades"
                                name="fortalezasOportunidades"
                                value={form.fortalezasOportunidades}
                                onChange={handleChange}
                                rows={5}
                            />
                            <InputTextArea
                                label="Amenazas y Debilidades"
                                name="amenazasDebilidades"
                                value={form.amenazasDebilidades}
                                onChange={handleChange}
                                rows={5}
                            />
                            <InputTextArea
                                label="Observaciones"
                                name="observaciones"
                                value={form.observaciones}
                                onChange={handleChange}
                                rows={5}
                            />
                            <InputTextArea
                                label="Recomendaciones"
                                name="recomendaciones"
                                value={form.recomendaciones}
                                onChange={handleChange}
                                rows={5}
                            />
                        </div>
                    </fieldset>
                    <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
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
                            <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
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
                    </fieldset>
                </div>
            </div>
        </div>
    );
}