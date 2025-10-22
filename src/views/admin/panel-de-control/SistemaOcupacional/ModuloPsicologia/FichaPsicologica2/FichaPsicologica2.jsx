import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaPsicologica2";
import Swal from "sweetalert2";

const tabla = "ficha_psicologica_anexo02"
const today = getToday()

// Arrays para RadioTable de Orientación
const orientacionItems = [
    { name: "orientacionTiempo", label: "Tiempo" },
    { name: "orientacionEspacio", label: "Espacio" },
    { name: "orientacionPersona", label: "Persona" }
];

const orientacionOptions = [
    { value: "DESORIENTADO", label: "Desorientado" },
    { value: "ORIENTADO", label: "Orientado" }
];

export default function FichaPsicologica2() {
    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();
    const initialFormState = {
        // Datos personales
        norden: "",
        fechaExamen: today,
        esApto: undefined,
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Motivo de evaluación
        motivoEvaluacion: "",

        // Observación de Conductas
        presentacion: "",
        postura: "",
        discursoRitmo: "",
        discursoTono: "",
        discursoArticulacion: "",
        orientacionTiempo: "",
        orientacionEspacio: "",
        orientacionPersona: "",

        // Resultados de evaluación
        nivelIntelectual: "",
        coordinacionVisomotriz: "",
        nivelMemoria: "",
        personalidad: "",
        afectividad: "",

        // Recomendaciones y Conclusiones
        recomendaciones: "",
        areaCognitiva: "",
        areaEmocional: "",
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
        handleRadioButtonBoolean,
        handleRadioButton,
    } = useForm(initialFormState);

    const handleSave = () => {
        if (form.esApto === undefined) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Por favor, marque si es apto o no apto.",
            });
            return;
        }
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
                    {/* Datos Personales */}
                    <div>
                        <div className="p-4 text-[10px] space-y-3">
                            {/* Header con información del examen */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3 ">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-2">Datos Necesarios</h4>

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
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <h4 className="font-semibold mb-3">Datos Laborales</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-3">
                                    {/* Motivo Evaluación */}
                                    <section className="bg-white border border-gray-200 rounded-lg p-3">
                                        <InputTextArea
                                            label="Motivo Evaluación"
                                            rows={4}
                                            name="motivoEvaluacion"
                                            value={form.motivoEvaluacion}
                                            onChange={handleChange}
                                        />
                                    </section>

                                    {/* Observación de Conductas */}
                                    <section className="bg-white border border-gray-200 rounded-lg p-3">
                                        <h4 className="font-semibold mb-2">Observación de Conductas</h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            {/* Presentación */}
                                            <div className="border rounded p-3">
                                                <h5 className="font-semibold mb-2">Presentación</h5>
                                                <InputsRadioGroup
                                                    name="presentacion"
                                                    value={form.presentacion}
                                                    vertical
                                                    onChange={handleRadioButton}
                                                    options={[
                                                        { label: "Adecuado", value: "ADECUADO" },
                                                        { label: "Inadecuado", value: "INADECUADO" },
                                                    ]}
                                                />
                                            </div>

                                            {/* Postura */}
                                            <div className="border rounded p-3">
                                                <h5 className="font-semibold mb-2">Postura</h5>
                                                <InputsRadioGroup
                                                    name="postura"
                                                    value={form.postura}
                                                    vertical
                                                    onChange={handleRadioButton}
                                                    options={[
                                                        { label: "Erguida", value: "ERGUIDA" },
                                                        { label: "Encorvada", value: "ENCORVADA" },
                                                    ]}
                                                />
                                            </div>

                                            {/* Discurso - Ritmo */}
                                            <div className="border rounded p-3">
                                                <h5 className="font-semibold mb-2">Discurso: Ritmo</h5>
                                                <InputsRadioGroup
                                                    name="discursoRitmo"
                                                    value={form.discursoRitmo}
                                                    onChange={handleRadioButton}
                                                    vertical
                                                    options={[
                                                        { label: "Lento", value: "LENTO" },
                                                        { label: "Rápido", value: "RAPIDO" },
                                                        { label: "Fluido", value: "FLUIDO" },
                                                    ]}
                                                />
                                            </div>

                                            {/* Discurso - Tono */}
                                            <div className="border rounded p-3">
                                                <h5 className="font-semibold mb-2">Discurso: Tono</h5>
                                                <InputsRadioGroup
                                                    name="discursoTono"
                                                    value={form.discursoTono}
                                                    onChange={handleRadioButton}
                                                    vertical
                                                    options={[
                                                        { label: "Bajo", value: "BAJO" },
                                                        { label: "Moderado", value: "MODERADO" },
                                                        { label: "Alto", value: "ALTO" },
                                                    ]}
                                                />
                                            </div>

                                            {/* Discurso - Articulación */}
                                            <div className="border rounded p-3">
                                                <h5 className="font-semibold mb-2">Discurso: Articulación</h5>
                                                <InputsRadioGroup
                                                    name="discursoArticulacion"
                                                    value={form.discursoArticulacion}
                                                    onChange={handleRadioButton}
                                                    vertical
                                                    options={[
                                                        { label: "Con dificultad", value: "CON_DIFICULTAD" },
                                                        { label: "Sin dificultad", value: "SIN_DIFICULTAD" },
                                                    ]}
                                                />
                                            </div>

                                            {/* Orientación */}
                                            <div className="border rounded p-3 col-span-3">
                                                <h5 className="font-semibold mb-4">Orientación</h5>
                                                <RadioTable
                                                    items={orientacionItems}
                                                    options={orientacionOptions}
                                                    form={form}
                                                    handleRadioButton={handleRadioButton}
                                                    labelColumns={1}
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                {/* Resultados de Evaluación */}
                                <section className="bg-white border border-gray-200 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">Resultados de Evaluación</h4>
                                    <div className="grid gap-4">
                                        <InputTextOneLine
                                            label="Nivel Intelectual"
                                            name="nivelIntelectual"
                                            value={form.nivelIntelectual}
                                            onChange={handleChange}
                                            labelWidth="160px"
                                        />
                                        <InputTextOneLine
                                            label="Coordinación Visomotriz"
                                            name="coordinacionVisomotriz"
                                            value={form.coordinacionVisomotriz}
                                            onChange={handleChange}
                                            labelWidth="160px"
                                        />
                                        <InputTextOneLine
                                            label="Nivel de Memoria"
                                            name="nivelMemoria"
                                            value={form.nivelMemoria}
                                            onChange={handleChange}
                                            labelWidth="160px"
                                        />
                                        <InputTextArea
                                            rows={8}
                                            label="Personalidad"
                                            name="personalidad"
                                            value={form.personalidad}
                                            onChange={handleChange}
                                        />
                                        <InputTextArea
                                            rows={5}
                                            label="Afectividad"
                                            name="afectividad"
                                            value={form.afectividad}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>
                            </div>
                            {/* Recomendaciones y Conclusiones */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">Recomendaciones</h4>
                                    <InputTextArea
                                        rows={9}
                                        name="recomendaciones"
                                        value={form.recomendaciones}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">Conclusiones</h4>
                                    <div className="space-y-3">
                                        <InputTextArea
                                            rows={4}
                                            label="Área Cognitiva"
                                            name="areaCognitiva"
                                            value={form.areaCognitiva}
                                            onChange={handleChange}
                                        />
                                        <InputTextArea
                                            rows={4}
                                            label="Área Emocional"
                                            name="areaEmocional"
                                            value={form.areaEmocional}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
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
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}