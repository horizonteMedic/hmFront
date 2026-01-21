import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { getToday } from "../../../../../../utils/helpers";
import { InputTextOneLine, SectionFieldset } from "../../../../../../components/reusableComponents/ResusableComponents";
import { PrintHojaR, VerifyTR, SubmitDataService } from "./controllerThevenon";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesAccion from "../../../../../../components/templates/BotonesAccion";

const tabla = "thevenon";

const colorOptions = ["Marrón", "Mostaza", "Verdoso"];
const consistenciaOptions = ["Sólido", "Semisólido", "Diarreico"];
const presenceOptions = ["Ausente", "Presente"];
const resultadoOptions = ["Negativo", "Positivo"];

export default function Thevenon() {
    const { token, userlogued, selectedSede, userName } = useSessionData();
    const today = getToday();

    const initialFormState = {
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

        muestra: "HECES",
        color: "",
        consistencia: "",
        sangrev: "",
        resultado: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

        nombre_doctorAsignado: "",
        user_doctorAsignado: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState);

    const toggleOption = (field, value) => {
        const normalized = value.toUpperCase();
        setForm((prev) => ({
            ...prev,
            [field]: prev[field] === normalized ? "" : normalized,
        }));
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleClearnotO();
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };


    const renderPresenceGroup = (label, field, options = presenceOptions, disabledInput = true) => (
        <div className="space-y-2">
            <InputTextOneLine
                label={label}
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled
                labelWidth="120px"
            />
            <div className="flex items-center gap-4">
                <label className="font-semibold" style={{ minWidth: "120px", maxWidth: "120px" }}></label>
                <div className="flex flex-wrap gap-3">
                    {options.map((opt) => (
                        <label
                            key={`${field}-${opt}`}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="checkbox"
                                checked={form[field] === opt.toUpperCase()}
                                onChange={() => toggleOption(field, opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto text-[10px]">
            {/* Información del Examen */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InputTextOneLine
                    label="N° Orden"
                    name="norden"
                    value={form.norden}
                    onChange={handleChangeNumberDecimals}
                    onKeyUp={handleSearch}
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
            </SectionFieldset>

            <SectionFieldset legend="Datos Personales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <InputTextOneLine
                    label="Nombres"
                    name="nombres"
                    value={form.nombres}
                    disabled
                    labelWidth="120px"
                />
                <div className="grid lg:grid-cols-2 gap-3">
                    <InputTextOneLine
                        label="Edad (Años)"
                        name="edad"
                        value={form.edad}
                        disabled
                        labelWidth="120px"
                    />
                    <InputTextOneLine
                        label="Sexo"
                        name="sexo"
                        value={form.sexo}
                        disabled
                        labelWidth="120px"
                    />
                </div>
                <div className="grid lg:grid-cols-2 gap-3">
                    <InputTextOneLine
                        label="DNI"
                        name="dni"
                        value={form.dni}
                        labelWidth="120px"
                        disabled
                    />
                    <InputTextOneLine
                        label="Fecha Nacimiento"
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        disabled
                        labelWidth="120px"
                    />
                </div>
                <InputTextOneLine
                    label="Lugar Nacimiento"
                    name="lugarNacimiento"
                    value={form.lugarNacimiento}
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
            </SectionFieldset>
            <SectionFieldset legend="Datos Laborales" collapsible className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            </SectionFieldset>

            <SectionFieldset legend="Muestra" className="space-y-3">
                <InputTextOneLine
                    label="Muestra"
                    name="muestra"
                    value={form.muestra}
                    onChange={handleChange}
                    labelWidth="120px"
                />
                {renderPresenceGroup("Color", "color", colorOptions)}
                {renderPresenceGroup("Consistencia", "consistencia", consistenciaOptions)}
                {renderPresenceGroup("Sangre Visible", "sangrev")}
            </SectionFieldset>

            <SectionFieldset legend="Resultado" className="space-y-4">
                {renderPresenceGroup("Resultado", "resultado", resultadoOptions)}
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorAsignado"
                    idField="user_doctorAsignado"
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

