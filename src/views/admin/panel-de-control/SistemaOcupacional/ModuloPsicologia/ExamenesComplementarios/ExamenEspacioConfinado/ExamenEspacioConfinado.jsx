import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerExamenEspacioConfinado";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "psicologia_espacios_confinados";

export default function ExamenEspacioConfinado() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

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
        handleChangeNumberDecimals,
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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumberDecimals}
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
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    name="esApto"
                    value={form.esApto}
                    trueLabel="APTO"
                    falseLabel="NO APTO"
                    labelWidth="120px"
                    onChange={handleRadioButtonBoolean}
                />
            </SectionFieldset>
            <SectionFieldset legend="Datos Personales">
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
            </SectionFieldset>
            <SectionFieldset legend="Datos Laborales">
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
            </SectionFieldset>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SectionFieldset legend="Aspecto Intelectual">
                    <RadioTable
                        items={aspectoIntelectualItems}
                        options={aspectoIntelectualOptions}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                </SectionFieldset>

                <SectionFieldset legend="Aspectos Personalidad">
                    <div className="space-y-8">
                        <InputsRadioGroup
                            label="1.- ESTABILIDAD EMOCIONAL"
                            labelOnTop
                            name="estabilidadEmocional"
                            value={form.estabilidadEmocional}
                            onChange={handleRadioButton}
                            options={estabilidadOptions}
                        />
                        <InputsRadioGroup
                            label="2.- NIVEL DE ANSIEDAD GENERAL"
                            labelOnTop
                            name="nivelAnsiedadGeneral"
                            value={form.nivelAnsiedadGeneral}
                            onChange={handleRadioButton}
                            options={nivelAnsiedadOptions}
                        />
                        <InputsRadioGroup
                            label="3.- ANSIEDAD A ESPACIOS CONFINADOS"
                            labelOnTop
                            name="ansiedadEspaciosConfinados"
                            value={form.ansiedadEspaciosConfinados}
                            onChange={handleRadioButton}
                            options={ansiedadOptions}
                            vertical
                        />
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Análisis y Resultados">
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
                                rows={5}
                            />
                        </div>
                    </div>
                </SectionFieldset>
            </div>

            {/* Botones de acción */}
            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div >
    );
}