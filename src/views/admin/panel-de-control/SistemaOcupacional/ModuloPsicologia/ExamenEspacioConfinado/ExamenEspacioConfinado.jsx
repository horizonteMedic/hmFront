import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { useForm } from "../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerExamenEspacioConfinado";

const tabla = "psicologia_espacios_confinados";
const today = getToday();

export default function ExamenEspacioConfinado() {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fechaExamen: today,
        nombreExamen: "",
        esApto: undefined,

        // Datos Personales - Columna Izquierda
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",

        // Datos Personales - Columna Derecha
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Criterios Psicológicos - Aspecto Intelectual
        razonamiento: "",
        memoria: "",
        atencionConcentracion: "",
        coordinacionVisoMotora: "",
        orientacionEspacial: "",

        // Criterios Psicológicos - Aspectos Personalidad
        estabilidadEmocional: "",
        nivelAnsiedadGeneral: "",
        ansiedadEspaciosConfinados: "",

        // Análisis y Resultados
        analisisResultados: "",
        recomendaciones: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);

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

    // Arrays para RadioTable - Aspecto Intelectual
    const aspectoIntelectualItems = [
        { name: "razonamiento", label: "1.- RAZONAMIENTO:" },
        { name: "memoria", label: "2.- MEMORIA:" },
        { name: "atencionConcentracion", label: "3.- ATENCIÓN Y CONCENTRACIÓN:" },
        { name: "coordinacionVisoMotora", label: "4.- COORDINACIÓN VISO-MOTORA:" },
        { name: "orientacionEspacial", label: "5.- ORIENTACIÓN ESPACIAL:" }
    ];

    const aspectoIntelectualOptions = [
        { label: "I", value: "I" },
        { label: "NPI", value: "NPI" },
        { label: "NP", value: "NP" },
        { label: "NPS", value: "NPS" },
        { label: "S", value: "S" },
    ];

    const ansiedadOptions = [
        { label: "NADA", value: "NADA" },
        { label: "POCA ANSIEDAD", value: "POCA_ANSIEDAD" },
        { label: "MODERADAMENTE ANSIOSO", value: "MODERADAMENTE_ANSIOSO" },
        { label: "ELEVADAMENTE ANSIOSO", value: "ELEVADAMENTE_ANSIOSO" },
    ];

    const estabilidadOptions = [
        { label: "INESTABLE", value: "INESTABLE" },
        { label: "ESTABLE", value: "ESTABLE" },
    ];

    const nivelAnsiedadOptions = [
        { label: "CASO", value: "CASO" },
        { label: "NO CASO", value: "NO_CASO" },
    ];

    return (
        <div className="space-y-6 px-4 pt-4">
            {/* Header con información del examen */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Fecha Entrevista"
                        name="fechaExamen"
                        type="date"
                        value={form.fechaExamen}
                        onChange={handleChangeSimple}
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Tipo de Examen"
                        name="nombreExamen"
                        value={form.nombreExamen}
                        disabled
                        labelWidth="120px"
                    />
                    <div className="flex gap-4 items-center">
                        <h4 className="font-semibold min-w-[120px] max-w-[120px]">Aptitud:</h4>
                        <InputsBooleanRadioGroup
                            name="esApto"
                            value={form.esApto}
                            trueLabel="APTO"
                            falseLabel="NO APTO"
                            onChange={handleRadioButtonBoolean}
                        />
                    </div>
                </div>
            </div>
            {/* Contenido principal */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-700">Datos Necesarios</h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Nombres"
                            name="nombres"
                            value={form.nombres}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Apellidos"
                            name="apellidos"
                            value={form.apellidos}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Fecha Nacimiento"
                            name="fechaNacimiento"
                            value={form.fechaNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Lugar Nacimiento"
                            name="lugarNacimiento"
                            value={form.lugarNacimiento}
                            disabled
                            labelWidth="120px"
                        />
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Domicilio Actual"
                            name="domicilioActual"
                            value={form.domicilioActual}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Edad"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Estado Civil"
                            name="estadoCivil"
                            value={form.estadoCivil}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Nivel Estudios"
                            name="nivelEstudios"
                            value={form.nivelEstudios}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-700">Datos Laborales</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Empresa"
                        name="empresa"
                        value={form.empresa}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Contrata"
                        name="contrata"
                        value={form.contrata}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Ocupación"
                        name="ocupacion"
                        value={form.ocupacion}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Cargo Desempeñar"
                        name="cargoDesempenar"
                        value={form.cargoDesempenar}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </div>

            {/* Criterios Psicológicos */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-blue-700 text-center text-lg">CRITERIOS PSICOLÓGICOS</h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Aspecto Intelectual */}
                    <div>
                        <h4 className="font-semibold mb-3 text-blue-600">ASPECTO INTELECTUAL:</h4>
                        <RadioTable
                            items={aspectoIntelectualItems}
                            options={aspectoIntelectualOptions}
                            form={form}
                            handleRadioButton={handleRadioButton}
                        />
                    </div>

                    {/* Aspectos Personalidad */}
                    <div>
                        <h4 className="font-semibold mb-3 text-blue-600">ASPECTOS PERSONALIDAD:</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium mb-2">1.- ESTABILIDAD EMOCIONAL:</label>
                                <InputsRadioGroup
                                    name="estabilidadEmocional"
                                    value={form.estabilidadEmocional}
                                    onChange={handleRadioButton}
                                    options={estabilidadOptions}
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">2.- NIVEL DE ANSIEDAD GENERAL:</label>
                                <InputsRadioGroup
                                    name="nivelAnsiedadGeneral"
                                    value={form.nivelAnsiedadGeneral}
                                    onChange={handleRadioButton}
                                    options={nivelAnsiedadOptions}
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">3.- ANSIEDAD A ESPACIOS CONFINADOS:</label>
                                <div className="space-y-2">
                                    <InputsRadioGroup
                                        name="ansiedadEspaciosConfinados"
                                        value={form.ansiedadEspaciosConfinados}
                                        onChange={handleRadioButton}
                                        options={ansiedadOptions}
                                        vertical
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Análisis y Resultados */}
                    <div>
                        <div className="space-y-4">
                            <InputTextArea
                                label="ANÁLISIS Y RESULTADOS"
                                name="analisisResultados"
                                value={form.analisisResultados}
                                onChange={handleChange}
                                rows={8}
                            />
                            <div className="mt-4">
                                <InputTextArea
                                    label="RECOMENDACIONES"
                                    name="recomendaciones"
                                    value={form.recomendaciones}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
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
                            onChange={handleChangeNumber}
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
            </section>
        </div>
    );
}