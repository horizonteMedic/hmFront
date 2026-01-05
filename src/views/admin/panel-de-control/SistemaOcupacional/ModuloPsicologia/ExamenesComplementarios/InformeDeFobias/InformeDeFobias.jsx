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
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "fobias";

export default function InformeDeFobias() {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
        norden: "",
        fecha: today,
        nombreExamen: "",
        esApto: undefined,

        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        edad: "",
        sexo: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos Laborales
        empresa: "",
        contrata: "",
        ocupacion: "",
        cargoDesempenar: "",

        // Criterios psicológicos
        inteligencia: "",
        fobias: "",

        // Análisis FODA
        fortalezasOportunidades: "",
        amenazasDebilidades: "",

        // Observaciones y recomendaciones
        observaciones: "",
        recomendaciones: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
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
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-4 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onKeyUp={handleSearch}
                    onChange={handleChangeNumberDecimals}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre del Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
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

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Criterios Psicológicos" className="grid gap-x-4 gap-y-3">
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
            </SectionFieldset>

            <SectionFieldset legend="Análisis FODA" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
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
            </SectionFieldset>

            <SectionFieldset legend="Observaciones y Recomendaciones" className="grid md:grid-cols-2 gap-x-4 gap-y-3">
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
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
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