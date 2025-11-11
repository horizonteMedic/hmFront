import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    RadioTable,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformeRiesgoPsicosocial";

const tabla = "informe_riesgos_psicosociales";
const today = getToday();

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

const conclusionOptions = [
    { label: "CUMPLE CON EL PERFIL", value: "CUMPLE" },
    { label: "NO CUMPLE CON EL PERFIL", value: "NO_CUMPLE" },
];

export default function InformeRiesgoPsicosocial() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        codigoInformeRiesgoPsicosocial: null,
        fechaExam: today,
        nombreExamen: "",

        // Datos personales
        nombres: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        domicilioActual: "",
        edad: "",
        estadoCivil: "",
        nivelEstudios: "",

        // Datos laborales
        ocupacion: "",
        cargoDesempenar: "",
        empresa: "",
        contrata: "",

        // Riesgos Psicosociales
        exigenciasPsicologicas: "",
        trabajoActivoDesarrollo: "",
        apoyoSocial: "",
        compensaciones: "",
        doblePresencia: "",

        // Texto libre
        recomendaciones: "",
        analisisResultados: "",
        conclusionPerfil: "",
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
        handleRadioButton,
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
        <div className="mx-auto bg-white overflow-hidden">
            <div className="flex h-full">
                <div className="w-full space-y-3 px-4">
                    {/* Header */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                                name="fechaExam"
                                type="date"
                                value={form.fechaExam}
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

                        </div>
                    </div>

                    {/* Datos Personales */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
                        <legend className="font-bold mb-3 text-[10px]">Datos Personales</legend>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <InputTextOneLine label="Nombres" name="nombres" value={form.nombres} disabled labelWidth="160px" />
                                <InputTextOneLine label="Apellidos" name="apellidos" value={form.apellidos} disabled labelWidth="160px" />
                                <InputTextOneLine label="Domicilio Actual" name="domicilioActual" value={form.domicilioActual} disabled labelWidth="160px" />
                                <InputTextOneLine label="Fecha Nacimiento" name="fechaNacimiento" value={form.fechaNacimiento} disabled labelWidth="160px" />
                                <InputTextOneLine label="Nivel de Estudios" name="nivelEstudios" value={form.nivelEstudios} disabled labelWidth="160px" />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine label="DNI" name="dni" value={form.dni} disabled labelWidth="160px" />
                                <InputTextOneLine label="Edad (años)" name="edad" value={form.edad} disabled labelWidth="160px" />
                                <InputTextOneLine label="Estado Civil" name="estadoCivil" value={form.estadoCivil} disabled labelWidth="160px" />
                                <InputTextOneLine label="Lugar Nacimiento" name="lugarNacimiento" value={form.lugarNacimiento} disabled labelWidth="160px" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Datos Laborales */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
                        <legend className="font-bold mb-3 text-[10px]">Datos Laborales</legend>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <InputTextOneLine label="Ocupación" name="ocupacion" value={form.ocupacion} disabled labelWidth="160px" />
                                <InputTextOneLine label="Cargo a desempeñar" name="cargoDesempenar" value={form.cargoDesempenar} disabled labelWidth="160px" />
                            </div>
                            <div className="space-y-3">
                                <InputTextOneLine label="Empresa" name="empresa" value={form.empresa} disabled labelWidth="160px" />
                                <InputTextOneLine label="Contrata" name="contrata" value={form.contrata} disabled labelWidth="160px" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Riesgos y Recomendaciones */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
                            <legend className="font-bold mb-3 text-[10px]">Riesgos Psicosociales</legend>
                            <RadioTable
                                items={riesgosItems}
                                options={riesgoOptions}
                                form={form}
                                handleRadioButton={handleRadioButton}
                            />
                        </fieldset>
                        <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
                            <legend className="font-bold mb-3 text-[10px]">Recomendaciones y Conclusión</legend>
                            <div className="space-y-3">
                                <InputTextArea
                                    label="Recomendaciones"
                                    name="recomendaciones"
                                    value={form.recomendaciones}
                                    onChange={handleChange}
                                    rows={10}
                                />
                                <InputsRadioGroup
                                    label="Conclusión"
                                    name="conclusionPerfil"
                                    value={form.conclusionPerfil}
                                    options={conclusionOptions}
                                    labelWidth="120px"
                                    onChange={handleRadioButton}
                                />
                            </div>
                        </fieldset>
                    </div>

                    {/* Análisis y Resultados */}
                    <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
                        <legend className="font-bold mb-3 text-[10px]">Análisis y Resultados</legend>
                        <InputTextArea
                            label=""
                            name="analisisResultados"
                            value={form.analisisResultados}
                            onChange={handleChange}
                            rows={6}
                        />
                    </fieldset>

                    {/* Footer acciones */}
                    <fieldset className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
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
                    </fieldset>
                </div>
            </div>
        </div>
    );
}
