import { useForm } from "../../../../../../hooks/useForm"
import { getToday } from "../../../../../../utils/helpers";
import {
    InputTextOneLine,
    InputsRadioGroup,
    RadioTable,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerAversionRiesgo";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = ""

export default function AversionRiesgo() {
    const today = getToday();
    const initialFormState = {
        norden: "",
        fechaExam: today,
        nombreExamen: "",

        nombres: "",
        dni: "",
        edad: "",
        sexo: "",

        empresa: "",
        contrata: "",
        areaTrabajo: "",
        puestoActual: "",

        practicaFuncional: "",
        recursividad: "",
        capacidadAtencion: "",

        estabilidadEmocional: "",
        flexibilidadEmociones: "",
        controlImpulsos: "",

        subordinacion: "",
        adecuacionNormas: "",
        consideracionTerceros: "",
        autonomiaTrabajo: "",
        proactividad: "",
        capacidadPresion: "",
        evaluacionRiesgos: "",
        motivacionCargo: "",

        analisisResultados: "",
        recomendaciones: "",

        conclusion: "",
    }
    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleRadioButton,
        handleChangeSimple,
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

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form?.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
                />
                <InputTextOneLine
                    label="Fecha"
                    name="fechaExam"
                    type="date"
                    value={form?.fechaExam}
                    onChange={handleChangeSimple}
                />
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="nombreExamen"
                    value={form.nombreExamen}
                    disabled
                    labelWidth="120px"
                />
            </SectionFieldset>

            <SectionFieldset legend="Datos del Paciente" >
                {/* Fila 1: Nombres, DNI, Edad, Género */}
                <div className="grid grid-cols-1 md:grid-cols-2  gap-3 mb-3">
                    <InputTextOneLine
                        label="Nombres y Apellidos"
                        name="nombres"
                        value={form?.nombres}
                        disabled
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <InputTextOneLine
                            label="DNI"
                            name="dni"
                            value={form?.dni}
                            disabled
                        />
                        <InputTextOneLine
                            label="Edad"
                            name="edad"
                            value={form?.edad}
                            disabled
                        />
                        <InputTextOneLine
                            label="Sexo"
                            name="sexo"
                            value={form?.sexo}
                            disabled
                        />
                    </div>
                    <InputTextOneLine
                        label="Empresa"
                        name="empresa"
                        value={form?.empresa}
                        disabled
                    />
                    <InputTextOneLine
                        label="Contrata"
                        name="contrata"
                        value={form?.contrata}
                        disabled
                    />
                    <InputTextOneLine
                        label="Area de Trabajo"
                        name="areaTrabajo"
                        value={form?.areaTrabajo}
                        disabled
                    />
                    <InputTextOneLine
                        label="Puesto de Trabajo"
                        name="puestoActual"
                        value={form?.puestoActual}
                        disabled
                    />
                </div>
            </SectionFieldset>

            {/* Contenido*/}
            <div className="space-y-3 grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4 mt-3">
                    <SectionFieldset legend="Aspectos Intelectuales">
                        <RadioTable
                            items={[
                                { name: "practicaFuncional", label: "Practica y Funcional" },
                                { name: "recursividad", label: "Recursividad" },
                                { name: "capacidadAtencion", label: "Capacidad de atención y concentración" }
                            ]}
                            options={[
                                { value: "BAJO", label: "Bajo" },
                                { value: "MEDIO", label: "Medio" },
                                { value: "ALTO", label: "Alto" }
                            ]}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={2}
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Aspectos Emocionales" >
                        <RadioTable
                            items={[
                                { name: "estabilidadEmocional", label: "Estabilidad emocional - madurez" },
                                { name: "flexibilidadEmociones", label: "Flexibilidad en el manejo de las emociones" },
                                { name: "controlImpulsos", label: "Control de impulsos" }
                            ]}
                            options={[
                                { value: "BAJO", label: "Bajo" },
                                { value: "MEDIO", label: "Medio" },
                                { value: "ALTO", label: "Alto" }
                            ]}
                            form={form}
                            handleRadioButton={handleRadioButton}
                            labelColumns={2}
                        />
                    </SectionFieldset>
                </div>
                <SectionFieldset legend="Comp. Esp. Conducta Segura" >
                    <RadioTable
                        items={[
                            { name: "subordinacion", label: "Capacidad de subordinación" },
                            { name: "adecuacionNormas", label: "Adecuación a las normas y procedimientos" },
                            { name: "consideracionTerceros", label: "Consideración de terceros" },
                            { name: "autonomiaTrabajo", label: "Autonomía para trabajar" },
                            { name: "proactividad", label: "Proactividad" },
                            { name: "capacidadPresion", label: "Capacidad para trabajar bajo presión" },
                            { name: "evaluacionRiesgos", label: "Capacidad para evaluar riesgos" },
                            { name: "motivacionCargo", label: "Motivación por el cargo" },
                        ]}
                        options={[
                            { value: "BAJO", label: "Bajo" },
                            { value: "MEDIO", label: "Medio" },
                            { value: "ALTO", label: "Alto" },
                        ]}
                        form={form}
                        handleRadioButton={handleRadioButton}
                        labelColumns={2}
                    />
                </SectionFieldset>
                <section className="space-y-3">
                    <SectionFieldset legend="Análisis y Resultados">
                        <InputTextArea
                            label="Análisis y Resultados"
                            value={form.analisisResultados}
                            onChange={handleChange}
                            rows={6}
                            name="analisisResultados"
                        />
                        <InputTextArea
                            label="Recomendaciones"
                            value={form.recomendaciones}
                            onChange={handleChange}
                            rows={6}
                            name="recomendaciones"
                        />
                    </SectionFieldset>
                    <SectionFieldset legend="Conclusión">
                        <InputsRadioGroup
                            name="conclusion"
                            value={form?.conclusion}
                            vertical
                            onChange={handleRadioButton}
                            options={[
                                { label: "CUMPLE CON EL PERFIL", value: "CUMPLE" },
                                { label: "NO CUMPLE CON EL PERFIL", value: "NO_CUMPLE" },
                            ]}
                        />
                    </SectionFieldset>
                </section>
            </div>

            <BotonesAccion
                form={form}
                handleSave={handleSave}
                handleClear={handleClear}
                handlePrint={handlePrint}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
            />
        </div>
    )
}