import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformeDeFobias";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "";
const today = getToday();

export default function InformeDeFobias() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Encabezado del examen
        norden: "",
        fechaEvaluacion: today,
        esApto: undefined,

        // Datos necesarios
        nombres: "",
        apellidos: "",
        edad: "",
        gradoEstudios: "",

        // Datos laborales
        empresa: "",
        cargo: "",

        // Criterios psicológicos
        inteligencia: "",
        fobias: "",

        // Análisis FODA
        fortalezasOportunidades: "",
        amenazasDebilidades: "",

        // Observaciones y recomendaciones
        observaciones: "",
        recomendaciones: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informePsicologicoFobiasPsicologia" });

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
                    onChange={handleChangeNumberDecimals}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha Evaluación"
                    name="fechaEvaluacion"
                    type="date"
                    value={form.fechaEvaluacion}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputsBooleanRadioGroup
                    label="Aptitud"
                    name="esApto"
                    labelWidth="120px"
                    value={form.esApto}
                    trueLabel="APTO"
                    falseLabel="NO APTO"
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
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-3">
                        <InputTextOneLine
                            label="Edad"
                            name="edad"
                            value={form.edad}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Grado de Estudios"
                            name="gradoEstudios"
                            value={form.gradoEstudios}
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
                        label="Cargo"
                        name="cargo"
                        value={form.cargo}
                        disabled
                        labelWidth="120px"
                    />
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <InputTextOneLine
                            label="1.- Inteligencia"
                            name="inteligencia"
                            value={form?.inteligencia}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="2.- Fobias"
                            name="fobias"
                            value={form?.fobias}
                            onChange={handleChange}
                            labelWidth="120px"
                        />
                    </div>
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

            {/* Acciones */}
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