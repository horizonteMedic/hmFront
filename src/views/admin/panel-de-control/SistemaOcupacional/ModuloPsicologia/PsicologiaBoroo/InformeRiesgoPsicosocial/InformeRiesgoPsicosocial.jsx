import {
    InputTextOneLine,
    InputTextArea,
    RadioTable,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformeRiesgoPsicosocial";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "informe_riesgos_psicosociales";


// Ítems de Riesgos Psicosociales
const riesgosItems = [
    { name: "exigenciasPsicologicas", label: "1. Exigencias psicológicas" },
    { name: "trabajoActivoDesarrollo", label: "2. Trabajo activo y posibilidades de desarrollo" },
    { name: "apoyoSocial", label: "3. Apoyo social" },
    { name: "compensaciones", label: "4. Compensaciones" },
    { name: "doblePresencia", label: "5. Doble presencia" },
];

// Opciones estandarizadas
const riesgoOptions = [
    { value: "FAVORABLE", label: "FAVORABLE" },
    { value: "PROMEDIO", label: "PROMEDIO" },
    { value: "DESFAVORABLE", label: "DESFAVORABLE" },
];


export default function InformeRiesgoPsicosocial() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fecha: today,
        nombreExamen: "",

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

        // Riesgos Psicosociales
        exigenciasPsicologicas: "",
        trabajoActivoDesarrollo: "",
        apoyoSocial: "",
        compensaciones: "",
        doblePresencia: "",

        // Texto libre
        recomendaciones: "",
        analisisResultados: "",
        conclusionPerfil: undefined,

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
    };

    const {
        form,
        setForm,
        handleChange,
        handleClearnotO,
        handleChangeNumberDecimals,
        handlePrintDefault,
        handleChangeNumber,
        handleChangeSimple,
        handleClear,
        handleRadioButton,
        handleRadioButtonBoolean
    } = useForm(initialFormState, { storageKey: "InformeRiesgoPsicosocial" });

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
        <div className="space-y-3 px-4 max-w-[90%]  xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Nombre de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <DatosPersonalesLaborales form={form} />

            <div className="grid md:grid-cols-2 gap-4">
                <SectionFieldset legend="Riesgos Psicosociales">
                    <RadioTable
                        items={riesgosItems}
                        options={riesgoOptions}
                        form={form}
                        handleRadioButton={handleRadioButton}
                    />
                </SectionFieldset>
                <SectionFieldset legend="Recomendaciones y Conclusión">
                    <div className="space-y-3">
                        <InputTextArea
                            label="Recomendaciones"
                            name="recomendaciones"
                            value={form.recomendaciones}
                            onChange={handleChange}
                            rows={10}
                        />
                        <InputsBooleanRadioGroup
                            label="Conclusión del Perfil"
                            name="conclusionPerfil"
                            value={form.conclusionPerfil}
                            labelWidth="120px"
                            onChange={handleRadioButtonBoolean}
                            trueLabel="Cumple"
                            falseLabel="No Cumple"
                        />

                    </div>
                </SectionFieldset>
            </div>

            <SectionFieldset legend="Análisis y Resultados">
                <InputTextArea
                    label=""
                    name="analisisResultados"
                    value={form.analisisResultados}
                    onChange={handleChange}
                    rows={6}
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
