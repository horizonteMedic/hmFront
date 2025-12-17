import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformePsicologicoADECO";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "informe_psicologico_estres";

export default function InformePsicologicoADECO() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fechaExamen: today,
        nombreExamen: "",
        esApto: undefined,

        // Datos Personales
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        edad: "",
        lugarNacimiento: "",
        domicilioActual: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Criterios Psicológicos
        escalaStress: "",
        somnolencia: "",
        testFatiga: "",

        // Análisis FODA
        fortalezasOportunidades: "",
        amenazasDebilidades: "",

        // Observaciones y Recomendaciones
        observaciones: "",
        recomendaciones: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleChangeNumberDecimals,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informePsicologicoADECOPsicologia" });

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
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
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
            <SectionFieldset legend="Datos Necesarios">
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
            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <InputTextOneLine
                            label="1.- Escala Sintomática de Estrés"
                            name="escalaStress"
                            value={form?.escalaStress}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="2.- Somnolencia"
                            name="somnolencia"
                            value={form?.somnolencia}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="3.- Test de Intensidad de Fatiga"
                            name="testFatiga"
                            value={form?.testFatiga}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                    </div>
                </div>
            </SectionFieldset>
            <SectionFieldset legend="Análisis FODA">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Fortalezas / Oportunidades"
                        name="fortalezasOportunidades"
                        value={form?.fortalezasOportunidades}
                        onChange={handleChange}
                        rows={4}
                    />
                    <InputTextArea
                        label="Amenazas / Debilidades"
                        name="amenazasDebilidades"
                        value={form?.amenazasDebilidades}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Observaciones y Recomendaciones">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Observaciones"
                        name="observaciones"
                        value={form?.observaciones}
                        onChange={handleChange}
                        rows={4}
                    />
                    <InputTextArea
                        label="Recomendaciones"
                        name="recomendaciones"
                        value={form?.recomendaciones}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </SectionFieldset>
            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    );
}