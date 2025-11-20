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
                            name="puestoPostula"
                            value={form?.puestoPostula}
                            disabled
                        />
                        <InputTextOneLine
                            label="Puesto de Trabajo"
                            name="puestoActual"
                            value={form?.puestoActual}
                            disabled
                        />
                        </div>
                    </section>
        
                    {/* Contenido*/}
                    <h1 className="text-blue-600 pl-4 ml-4 font-semibold ">Aspectos a Evaluar</h1>
                    <section className=" rounded-lg pt-2 mt-0 m-4 gap-4 flex">
                        <section className="bg-white border border-gray-200 rounded-lg flex w-[60%] gap-4">
                            <div className="w-1/2 flex-col">
                                <h1 className="text-blue-600 pl-4 ml-4 font-semibold mt-4">ASPECTOS INTELECTUALES</h1>
                                <section className="border bg-gray-50 border-gray-200 rounded-lg mt-0 p-4 m-4 gap-4">
                                    <RadioTable
                                        items={[
                                            { name: "orientacionTiempo", label: "Practica y Funcional" },
                                            { name: "orientacionEspacio", label: "Recursividad" },
                                            { name: "orientacionPersona", label: "Capacidad de atención y concentración" }
                                        ]}
                                        options={[
                                            { value: "DESORIENTADO", label: "Bajo" },
                                            { value: "ORIENTADO", label: "Medio" },
                                            { value: "ORIENTADO", label: "Alto" }
                                        ]}
                                        form={form}
                                        handleRadioButton={handleRadioButton}
                                        labelColumns={2}
                                    />
                                </section>
                                <h1 className="text-blue-600 pl-4 ml-4 font-semibold mt-4">ASPECTOS EMOCIONALES</h1>
                                <section className="border bg-gray-50 border-gray-200 rounded-lg mt-0 p-4 m-4 gap-4">
                                    <RadioTable
                                        items={[
                                            { name: "orientacionTiempo", label: "Estabilidad emocional - madurez" },
                                            { name: "orientacionEspacio", label: "Flexibilidad en el manejo de las emociones" },
                                            { name: "orientacionPersona", label: "Control de impulsos" }
                                        ]}
                                        options={[
                                            { value: "DESORIENTADO", label: "Bajo" },
                                            { value: "ORIENTADO", label: "Medio" },
                                            { value: "ORIENTADO", label: "Alto" }
                                        ]}
                                        form={form}
                                        handleRadioButton={handleRadioButton}
                                        labelColumns={2}
                                    />
                                </section>
                            </div>
                            <div className="w-1/2 flex-col">
                                <h1 className="text-blue-600 pl-4 ml-4 font-semibold mt-4">COMP. ESP. CONDUCTA SEGURA</h1>
                                <section className="border bg-gray-50 border-gray-200 rounded-lg mt-0 p-4 m-4 gap-4">
                                    <RadioTable
                                        items={[
                                            { name: "orientacionTiempo", label: "Capacidad de subordinación" },
                                            { name: "orientacionEspacio", label: "Adecuación a las normas y procedimientos" },
                                            { name: "orientacionPersona", label: "Consideración de terceros" },
                                            { name: "orientacionEspacio", label: "Autonomía para trabajar" },
                                            { name: "orientacionPersona", label: "Proactividad" },
                                            { name: "orientacionEspacio", label: "Capacidad para trabajar bajo presión" },
                                            { name: "orientacionPersona", label: "Capacidad para evaluar riesgos" },
                                            { name: "orientacionEspacio", label: "Motivación por el cargo" },
                                        ]}
                                        options={[
                                            { value: "DESORIENTADO", label: "Bajo" },
                                            { value: "ORIENTADO", label: "Medio" },
                                            { value: "ORIENTADO", label: "Alto" },
                                        ]}
                                        form={form}
                                        handleRadioButton={handleRadioButton}
                                        labelColumns={2}
                                    />
                                </section>
                            </div>
                        </section>
                        <section className="bg-white  flex-col rounded-lg flex w-[40%] gap-4">
                            <InputTextArea
                                label="ANALISIS Y RESULTADOS"
                                value={form.diagnostico}
                                onChange={handleChange}
                                rows={6}
                                classNameLabel="text-blue-600"
                                name="diagnostico"
                            />
                            <InputTextArea
                                label="RECOMENDACIONES"
                                value={form.diagnostico}
                                onChange={handleChange}
                                classNameLabel="text-blue-600"
                                rows={6}
                                name="diagnostico"
                            />
                            <h1 className="text-blue-600 font-bold mb-0 pb-0 ">Conclusión</h1>
                            <div className="flex flex-col gap-2 p-4 border-gray-200 border rounded-lg">
                                <InputsRadioGroup
                                    name="razonVisita"
                                    value={form?.razonVisita}
                                    vertical
                                    onChange={handleRadioButton}
                                    options={[
                                        { label: "CUMPLE CON EL PERFIL", value: "PRIMERA ACTITUD" },
                                        { label: "NO CUMPLE CON EL PERFIL", value: "REVALIDACION" },
                                    ]}
                                />
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
                        </section>
                    </section>

                    </div>
                </div>
                </div>
            </div>
        </>
    )
}