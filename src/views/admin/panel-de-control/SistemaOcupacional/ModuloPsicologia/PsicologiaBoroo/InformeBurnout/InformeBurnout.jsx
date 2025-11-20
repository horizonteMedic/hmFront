import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPrint, faBroom } from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
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
        <div className="px-4 space-y-3">
            {/* Header con información del examen */}
            <div className="w-full space-y-3">
                <SectionFieldset legend="Información del Examen">
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
                            name="fechaExamen"
                            type="date"
                            value={form.fechaExamen}
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
                </SectionFieldset>

                <SectionFieldset legend="Datos Personales">
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
                </SectionFieldset>

                <SectionFieldset legend="Datos Laborales">
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
                </SectionFieldset>
            </div>

            <SectionFieldset legend="Criterios Psicológicos">
                <div className="space-y-4">
                    <InputTextOneLine
                        label="Síndrome de Burnout"
                        name="sindromeBurnout"
                        value={form?.sindromeBurnout}
                        onChange={handleChange}
                        labelWidth="170px"
                    />
                    <div className="pt-2">
                        <h5 className="font-bold  mb-3">III. Sub Escalas</h5>
                        <div className="grid grid-cols-1 gap-3 ml-4">
                            <InputTextOneLine
                                label="-Agotamiento Emocional"
                                name="agotamientoEmocional"
                                value={form?.agotamientoEmocional}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="-Despersonalización"
                                name="despersonalizacion"
                                value={form?.despersonalizacion}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                            <InputTextOneLine
                                label="-Realización Personal"
                                name="realizacionPersonal"
                                value={form?.realizacionPersonal}
                                onChange={handleChange}
                                labelWidth="160px"
                            />
                        </div>
                    </div>
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Conclusiones Finales" className="space-y-3">
                <InputTextArea
                    label="Resultados"
                    name="resultados"
                    value={form?.resultados}
                    onChange={handleChange}
                    rows={4}
                />
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
            </SectionFieldset>

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