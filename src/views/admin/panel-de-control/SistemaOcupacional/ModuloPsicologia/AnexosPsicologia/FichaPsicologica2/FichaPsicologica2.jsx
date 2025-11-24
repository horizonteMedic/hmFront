import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerFichaPsicologica2";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";

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
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Datos personales
        norden: "",
        fechaExamen: today,
        esApto: undefined,
        nombreExamen: "",
        // Datos personales
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        ocupacion: "",
        cargoDesempenar: "",
        empresa: "",
        contrata: "",

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
    } = useForm(initialFormState, { storageKey: "fichaPsicologicaAnexo2" });

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
        <div className="px-4 space-y-3">
            {/* Header con información del examen */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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
                    label="Nombre Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    labelWidth="120px"
                    name="esApto"
                    value={form.esApto}
                    trueLabel="APTO"
                    falseLabel="NO APTO"
                    onChange={handleRadioButtonBoolean}
                />
            </SectionFieldset>
            {/* Datos Personales */}
            <SectionFieldset legend="Datos Personales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="160px" />
                    <InputTextOneLine label="Apellidos" name="apellidos" value={form.apellidos} disabled labelWidth="160px" />
                    <InputTextOneLine label="Fecha Nacimiento" name="fechaNacimiento" value={form.fechaNacimiento} disabled labelWidth="160px" />
                    <InputTextOneLine label="Lugar Nacimiento" name="lugarNacimiento" value={form.lugarNacimiento} disabled labelWidth="160px" />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine label="Domicilio Actual" name="domicilioActual" value={form.domicilioActual} disabled labelWidth="160px" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <InputTextOneLine label="Edad (años)" name="edad" value={form.edad} disabled labelWidth="160px" />
                        <InputTextOneLine label="Sexo" name="sexo" value={form.sexo} disabled labelWidth="160px" />
                    </div>
                    <InputTextOneLine label="Estado Civil" name="estadoCivil" value={form.estadoCivil} disabled labelWidth="160px" />
                    <InputTextOneLine label="Nivel de Estudios" name="nivelEstudios" value={form.nivelEstudios} disabled labelWidth="160px" />
                </div>
            </SectionFieldset>

            {/* Datos Laborales */}
            <SectionFieldset legend="Datos Laborales" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <InputTextOneLine label="Ocupación" name="ocupacion" value={form.ocupacion} disabled labelWidth="160px" />
                    <InputTextOneLine label="Cargo a desempeñar" name="cargoDesempenar" value={form.cargoDesempenar} disabled labelWidth="160px" />
                </div>
                <div className="space-y-3">
                    <InputTextOneLine label="Empresa" name="empresa" value={form.empresa} disabled labelWidth="160px" />
                    <InputTextOneLine label="Contrata" name="contrata" value={form.contrata} disabled labelWidth="160px" />
                </div>
            </SectionFieldset>
            <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                    {/* Motivo Evaluación */}
                    <SectionFieldset legend="Motivo Evaluación" fieldsetClassName="border-gray-200 rounded-lg">
                        <InputTextArea
                            rows={4}
                            name="motivoEvaluacion"
                            value={form.motivoEvaluacion}
                            onChange={handleChange}
                        />
                    </SectionFieldset>

                    {/* Observación de Conductas */}
                    <SectionFieldset legend="Observación de Conductas" className="grid xl:grid-cols-4 gap-4">
                        <SectionFieldset legend="Presentación">
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
                        </SectionFieldset>

                        <SectionFieldset legend="Postura">
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
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Ritmo">
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
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Tono">
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
                        </SectionFieldset>

                        <SectionFieldset legend="Discurso: Articulación">
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
                        </SectionFieldset>

                        <SectionFieldset legend="Orientación" fieldsetClassName="md:col-span-3">
                            <RadioTable
                                items={orientacionItems}
                                options={orientacionOptions}
                                form={form}
                                handleRadioButton={handleRadioButton}
                                labelColumns={1}
                            />
                        </SectionFieldset>
                    </SectionFieldset>
                </div>
                {/* Resultados de Evaluación */}
                <SectionFieldset legend="Resultados de Evaluación" fieldsetClassName="border-gray-200 rounded-lg">
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
                </SectionFieldset>
            </div>
            {/* Recomendaciones y Conclusiones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SectionFieldset legend="Recomendaciones" fieldsetClassName="border-gray-200 rounded-lg">
                    <InputTextArea
                        rows={9}
                        name="recomendaciones"
                        value={form.recomendaciones}
                        onChange={handleChange}
                    />
                </SectionFieldset>
                <SectionFieldset legend="Conclusiones" fieldsetClassName="border-gray-200 rounded-lg">
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
                </SectionFieldset>
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
    );
}