import { useSessionData } from "../../../../../../hooks/useSessionData";
import { useForm } from "../../../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../../utils/auditoriaUtils";
import { InputTextOneLine, SectionFieldset } from "../../../../../../components/reusableComponents/ResusableComponents";
import SearchButton from "../../../../../../components/reusableComponents/SearchButton";
import AccionesRegistroHeader from "../../../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../../../components/reusableComponents/AuditoriaRegistro";
import { PrintHojaR, VerifyTR, SubmitDataService, UpdateDataService } from "./controllerThevenon";
import DatosPersonalesLaborales from "../../../../../../components/templates/DatosPersonalesLaborales";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import BotonesForm from "../../../../../../components/templates/BotonesForm";

const tabla = "thevenon";

const colorOptions = ["Marrón", "Mostaza", "Verdoso"];
const consistenciaOptions = ["Sólido", "Semisólido", "Diarreico"];
const presenceOptions = ["Ausente", "Presente"];
const resultadoOptions = ["Negativo", "Positivo"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    "muestra",
    "color",
    "consistencia",
    "sangrev",
    "resultado",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

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

        // Control de UI: false = mostrar Guardar (nuevo) / true = mostrar Editar (ya existe)
        tieneRegistro: false,

        // Auditoría
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    };

    const {
        form,
        setForm,
        handleChange,
        handleChangeNumber,
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleClearnotO,
        handleClear,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "thevenon" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico y el doctor asignado se componen de 2 campos (id de firma + nombre): se detecta
    // el cambio por el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
    const isDoctorEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

    const toggleOption = (field, value) => {
        if (camposDeshabilitados) return;
        const normalized = value.toUpperCase();
        setForm((prev) => ({
            ...prev,
            [field]: prev[field] === normalized ? "" : normalized,
        }));
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla);
    };

    // ===== Búsqueda con botón =====
    const executeSearch = () => {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === 'Enter') {
            executeSearch();
        }
    };

    const hayRegistroCargado = Boolean(form.nombres);

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla);
        });
    };

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    const renderPresenceGroup = (label, field, options = presenceOptions) => (
        <div className="space-y-2">
            <InputTextOneLine
                label={label}
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled
                labelWidth="120px"
                edited={isFieldEdited(field)}
                onRevert={() => revertField(field)}
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
                                disabled={camposDeshabilitados}
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
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            {/* Información del Examen */}
            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumber}
                        onKeyUp={handleSearch}
                        disabled={hayRegistroCargado}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("fecha")}
                    onRevert={() => revertField("fecha")}
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

            <DatosPersonalesLaborales form={form} />

            <SectionFieldset legend="Muestra" className="space-y-3">
                <InputTextOneLine
                    label="Muestra"
                    name="muestra"
                    value={form.muestra}
                    onChange={handleChange}
                    labelWidth="120px"
                    disabled={camposDeshabilitados}
                    edited={isFieldEdited("muestra")}
                    onRevert={() => revertField("muestra")}
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
                    disabled={camposDeshabilitados}
                    edited={isMedicoEdited}
                    onRevert={revertMedico}
                />
                <EmpleadoComboBox
                    value={form.nombre_doctorAsignado}
                    label="Doctor Asignado"
                    form={form}
                    onChange={handleChangeSimple}
                    nameField="nombre_doctorAsignado"
                    idField="user_doctorAsignado"
                    disabled={camposDeshabilitados}
                    edited={isDoctorEdited}
                    onRevert={revertDoctor}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: AUDITORÍA DEL REGISTRO ===== */}
            {hayRegistroCargado && (
                <AuditoriaRegistro
                    mostrarEdicion={form.tieneRegistro}
                    fechaCreacion={auditoria.fechaCreacion}
                    fechaEdicion={auditoria.fechaActualizacion}
                    usuarioRegistro={auditoria.usuarioRegistro}
                    usuarioEdicion={auditoria.usuarioActualizacion}
                />
            )}

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <BotonesForm
                form={form}
                handleChangeNumberDecimals={handleChangeNumberDecimals}
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={handleClear}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />
        </div>
    );
}
