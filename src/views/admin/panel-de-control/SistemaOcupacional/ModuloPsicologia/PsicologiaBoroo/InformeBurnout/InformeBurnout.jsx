import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { getToday } from "../../../../../../utils/helpers";
import { useForm } from "../../../../../../hooks/useForm";
import { PrintHojaR, SubmitDataService, VerifyTR } from "./controllerInformeBurnout";

const tabla = "informe_burnout";
const today = getToday();

export default function InformeBurnout() {
    const { token, userlogued, selectedSede, datosFooter } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fechaExamen: today,
        nombreExamen: "",

        // Datos Personales
        nombres: "",
        apellidos: "",
        dni: "",
        edad: "",

        // Síndrome de Burnout
        sindromeBurnout: "",
        agotamientoEmocional: "",
        despersonalizacion: "",
        realizacionPersonal: "",

        // Textos libres
        resultados: "",
        conclusiones: "",
        recomendaciones: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "informeBurnoutPsicologia" });

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
        <div className="space-y-6 px-4 pt-4">
            {/* Header con información del examen */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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
                        onChange={handleChange}
                        labelWidth="120px"
                    />
                </div>
            </div>

            {/* Datos necesarios */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-700">Datos Necesarios</h4>
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
                            label="DNI"
                            name="dni"
                            value={form.dni}
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
                    </div>
                </div>
            </div>

            {/* Criterios Psicológicos */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-blue-700">Criterios Psicológicos</h3>
                <div className="space-y-4">
                    <InputTextOneLine
                        label="Síndrome de Burnout"
                        name="sindromeBurnout"
                        value={form?.sindromeBurnout}
                        onChange={handleChange}
                        labelWidth="160px"
                    />
                    <div className="pt-2">
                        <h5 className="font-semibold text-gray-700 mb-2">III. Sub Escalas</h5>
                        <div className="grid grid-cols-1 gap-3">
                            <InputTextOneLine
                                label="Agotamiento Emocional"
                                name="agotamientoEmocional"
                                value={form?.agotamientoEmocional}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="Despersonalización"
                                name="despersonalizacion"
                                value={form?.despersonalizacion}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="Realización Personal"
                                name="realizacionPersonal"
                                value={form?.realizacionPersonal}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Resultados */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-blue-700">Resultados</h3>
                <InputTextArea
                    label="Resultados"
                    name="resultados"
                    value={form?.resultados}
                    onChange={handleChange}
                    rows={4}
                />
            </section>

            {/* Conclusiones y Recomendaciones */}
            <section className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputTextArea
                        label="Conclusiones"
                        name="conclusiones"
                        value={form?.conclusiones}
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
            </section>

            {/* Acciones */}
            <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
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
                            onChange={handleChangeNumber}
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