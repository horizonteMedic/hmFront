import { InputTextOneLine, InputTextArea, SectionFieldset, RadioTable } from "../../../../components/reusableComponents/ResusableComponents";
import { useSessionData } from "../../../../hooks/useSessionData";
import { getToday, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerTamizajeDermatologico";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import SearchButton from "../../../../components/reusableComponents/SearchButton";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";

const tabla = "tamizaje_dermatologico";

const OPCIONES_SI_NO = [
    { value: true, label: "SI" },
    { value: false, label: "NO" },
];

// Preguntas del tamizaje (SI/NO) y detalles que se piden según la respuesta.
const PREGUNTAS_TAMIZAJE = [
    "enfermedadPiel",
    "algunaLesion",
    "coloracionPiel",
    "variasLesiones",
    "enrojecimiento",
    "comezon",
    "hinchazon",
    "alergiaAsma",
    "usaEpp",
    "cambiosEnUnas",
    "algunaMedicacion",
];
const DETALLES_TAMIZAJE = [
    "enfermedadPielDetalle",
    "algunaLesionLocalizacion",
    "algunaLesionDesdeCuando",
    "enrojecimientoLocalizacion",
    "comezonLocalizacion",
    "hinchazonLocalizacion",
    "usaEppProteccion",
];
const PREGUNTAS_MEDICO = ["dermatopatia", "necesitaDermatologo", "interconsultaDermatologia"];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fecha",
    ...PREGUNTAS_TAMIZAJE,
    ...DETALLES_TAMIZAJE,
    "comentarios",
    ...PREGUNTAS_MEDICO,
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function TamizajeDermatologico() {
    const today = getToday();
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header - Información del examen
        norden: "",
        fecha: today,
        nombreExamen: "",

        dni: "",
        nombres: "",
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

        // Tamizaje Dermatológico
        enfermedadPiel: false,
        enfermedadPielDetalle: "",
        algunaLesion: false,
        algunaLesionLocalizacion: "",
        algunaLesionDesdeCuando: "",
        coloracionPiel: false,
        variasLesiones: false,
        enrojecimiento: false,
        enrojecimientoLocalizacion: "",
        comezon: false,
        comezonLocalizacion: "",
        hinchazon: false,
        hinchazonLocalizacion: "",
        alergiaAsma: false,
        usaEpp: true,
        usaEppProteccion: "",
        cambiosEnUnas: false,
        algunaMedicacion: false,

        // Comentarios
        comentarios: "",

        // Para el médico
        dermatopatia: false,
        necesitaDermatologo: false,
        interconsultaDermatologia: false,

        // Médico que Certifica //BUSCADOR
        nombre_doctorAsignado: userName,
        user_doctorAsignado: userlogued,

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
        handleChangeNumberDecimals,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState, { storageKey: "tamizaje_dermatologico" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El doctor se compone de 2 campos (id + nombre): se detecta el cambio por el id y se revierten ambos.
    const isDoctorEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

    // Props comunes de un campo de texto: bloqueo, resaltado de cambios y botón de revertir.
    const campo = (name, onChange = handleChange) => ({
        name,
        value: form[name] ?? "",
        onChange,
        disabled: camposDeshabilitados,
        edited: isFieldEdited(name),
        onRevert: () => revertField(name),
    });

    // Detalle que aparece debajo de una pregunta cuando se responde SI.
    const detalle = (name, label) => (
        <InputTextOneLine label={label} labelWidth="200px" stackOnMobile {...campo(name)} />
    );

    // Tabla de preguntas SI/NO con bloqueo, resaltado de cambios y botón de revertir por fila.
    const tablaSiNo = (items) => (
        <RadioTable
            items={items}
            options={OPCIONES_SI_NO}
            labelColumns={6}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
            disabled={camposDeshabilitados}
            isFieldEdited={isFieldEdited}
            onRevert={revertField}
        />
    );

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
        handleClearnotO();
        VerifyTR(form.norden, tabla, token, setForm, selectedSede);
    };

    // ===== Búsqueda con enter =====
    const handleSearch = (e) => {
        if (!e || e.key === "Enter") {
            executeSearch();
        }
    };

    const handlePrintNordenChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // solo dígitos

        const hayDatosCargados = Boolean(form.nombres || form.dni || form.tieneRegistro);
        if (hayDatosCargados && value !== form.norden) {
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter);
        });
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={handleClear}
            />

            <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
                <div className="flex gap-x-3 w-full">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onChange={handleChangeNumberDecimals}
                        onKeyUp={handleSearch}
                        disabled={nordenDisabled}
                        labelWidth="120px"
                        className="w-full"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Fecha"
                    type="date"
                    labelWidth="120px"
                    {...campo("fecha", handleChangeSimple)}
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

            <SectionFieldset legend="Tamizaje">
                {tablaSiNo([
                    {
                        name: "enfermedadPiel",
                        label: "1.- ¿Sufre usted alguna enfermedad de la piel?",
                        extraContent: form.enfermedadPiel && detalle("enfermedadPielDetalle", "¿Qué diagnóstico tiene?"),
                    },
                    {
                        name: "algunaLesion",
                        label: "2.- Actualmente, ¿Tiene alguna lesión?",
                        extraContent: form.algunaLesion && (
                            <div className="grid gap-y-2">
                                {detalle("algunaLesionLocalizacion", "¿Dónde se localiza?")}
                                {detalle("algunaLesionDesdeCuando", "¿Desde cuándo tiene la lesión?")}
                            </div>
                        ),
                    },
                    { name: "coloracionPiel", label: "3.- ¿Presenta algún cambio de coloración de la piel?" },
                    { name: "variasLesiones", label: "4.- ¿Estas lesiones se repiten varias veces al año?" },
                    {
                        name: "enrojecimiento",
                        label: "5.- ¿Usted tiene enrojecimiento de alguna zona del cuerpo?",
                        extraContent: form.enrojecimiento && detalle("enrojecimientoLocalizacion", "¿Dónde se localiza?"),
                    },
                    {
                        name: "comezon",
                        label: "6.- ¿Tiene comezón?",
                        extraContent: form.comezon && detalle("comezonLocalizacion", "¿Dónde se localiza?"),
                    },
                    {
                        // Antes el detalle solo aparecía si ya tenía texto (`form.hinchazonLocalizacion`): al responder
                        // SI no había dónde escribirlo.
                        name: "hinchazon",
                        label: "7.- ¿Presenta hinchazón en parte de su cuerpo?",
                        extraContent: form.hinchazon && detalle("hinchazonLocalizacion", "Si respondió sí, ¿Dónde se localiza?"),
                    },
                    { name: "alergiaAsma", label: "8.- ¿Sufre de Rinitis Alérgica o ASMA?" },
                    {
                        name: "usaEpp",
                        label: "9.- ¿Usa EPP?",
                        extraContent: form.usaEpp && detalle("usaEppProteccion", "¿Qué tipo de protección usa?"),
                    },
                    { name: "cambiosEnUnas", label: "10.- ¿Presenta cambios en las uñas?" },
                    { name: "algunaMedicacion", label: "11.- ¿Está tomando alguna medicación?" },
                ])}
            </SectionFieldset>


            <SectionFieldset legend="Comentarios">
                <InputTextArea
                    rows={4}
                    {...campo("comentarios")}
                />
            </SectionFieldset>

            <SectionFieldset legend="Para el Médico">
                {tablaSiNo([
                    { name: "dermatopatia", label: "El paciente, al examen físico, ¿presenta alguna lesión sugerente a Dermatopatía?" },
                    { name: "necesitaDermatologo", label: "El paciente necesita ser evaluado por médico dermatológico para la realización de las siguientes pruebas: De sensibilidad subcutánea, luz de Wood y Maniobra de Nikolsky" },
                    { name: "interconsultaDermatologia", label: "El paciente, ¿Necesita interconsulta con la especialidad de Dermatología?" },
                ])}
            </SectionFieldset>

            <SectionFieldset legend="Asignación de Médico">
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
