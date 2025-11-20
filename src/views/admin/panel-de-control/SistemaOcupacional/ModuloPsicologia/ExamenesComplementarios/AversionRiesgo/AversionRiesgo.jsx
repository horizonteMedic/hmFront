import { faBroom, faPrint, faSave } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../../../../../hooks/useForm"
import { getToday } from "../../../../../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    InputTextOneLine,
    InputsRadioGroup,
    RadioTable,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";

const tabla = ""
const today = getToday();

export default function AversionRiesgo() {
    const initialFormState = {
        norden: "",
        fechaExam: today,

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
        handleChangeNumber,
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
        <div className="px-4 space-y-3">
            <SectionFieldset legend="Información del Examen">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form?.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                    />
                    <InputTextOneLine
                        label="Fecha"
                        name="fechaExam"
                        type="date"
                        value={form?.fechaExam}
                        onChange={handleChangeSimple}
                    />
                </div>
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

            <section className="flex flex-col md:flex-row justify-between items-center gap-4  px-4 pt-4">
                <div className=" flex gap-4">
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
    )
}