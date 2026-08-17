import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine"
import RadioTable from "../../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset"
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import { PrintHojaR, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerDireccionGeneralMineria";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const tabla = "ministerio_energia_minas";
const today = getToday();

const FACTORES_HEREDITARIOS_1 = [
    { name: "asma", label: "1.- Asma" },
    { name: "alergias", label: "2.- Alergias" },
    { name: "bronquitis", label: "3.- Bronquitis" },
    { name: "pleuresia", label: "4.- Pleuresia" },
    { name: "neumonia", label: "5.- Neumonia" },
    { name: "respiracion", label: "6.- Respiracion" },
    { name: "sangreSaliva", label: "7.- Sangre en la Saliva" },
    { name: "respiracionBreve", label: "8.- Respiracion Breve" },
    { name: "problemasNasales", label: "9.- Problemas Nasales" },
    { name: "tbc", label: "10.- T.B.C." },
    { name: "fuma", label: "Fuma" },
];

const FACTORES_HEREDITARIOS_2 = [
    { name: "palpitaciones", label: "11.- Palpitaciones" },
    { name: "ritmoCardiacoIrregular", label: "12.- Ritmo Cardiaco Irregular" },
    { name: "fallasCardiacas", label: "13.- Fallas Cardiacas" },
    { name: "desmayos", label: "14.- Desmayos" },
    { name: "tobillosHinchados", label: "15.- Tobillos Hinchados" },
    { name: "moretonesAnormales", label: "16.- Moretones Anormales" },
    { name: "presionAlta", label: "17.- Presion Alta" },
    { name: "heridasPecho", label: "18.- Heridas del Pecho" },
    { name: "otrasEnfermedades", label: "19.- Otras Enfermedades" },
    { name: "tomaMedicina", label: "Toma alguna medicina" },
];

const OPCIONES_SI_NO = [
    { label: "SI", value: true },
    { label: "NO", value: false },
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExamen",
    "colorPiel",
    "colorOjos",
    "cabello",
    ...FACTORES_HEREDITARIOS_1.map((i) => i.name),
    ...FACTORES_HEREDITARIOS_2.map((i) => i.name),
    "pulsoReposo",
    "pulsoReposoBp",
    "pulso30flexiones",
    "respiracionReposo",
    "respiracion30flexiones",
    "obstruccionNasal",
    "formaPecho",
    "expansionPecho",
    "enfermedadesCronicas",
    "enForma",
    "pechoNormal",
    "tbcRayosX",
    "pneumoconiosis",
    "clasificacionOit",
    "corazonRayosX",
    "otrosCambios",
    "hallazgosAnormales",
    "opinionClinica",
    "user_medicoFirma",
    "nombre_medico",
];

const DireccionGeneralMineria = () => {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        fechaExamen: today,
        tipoExamen: "",

        // Datos personales
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

        // Exámen médico (datos básicos, de Triaje)
        fechaNacimientoPaciente: "",
        peso: "",
        talla: "",
        colorPiel: "",
        colorOjos: "",
        cabello: "",

        // Factores hereditarios (1)
        asma: false,
        alergias: false,
        bronquitis: false,
        pleuresia: false,
        neumonia: false,
        respiracion: false,
        sangreSaliva: false,
        respiracionBreve: false,
        problemasNasales: false,
        tbc: false,
        fuma: false,

        // Factores hereditarios (2) / Cáncer pulmonar
        palpitaciones: false,
        ritmoCardiacoIrregular: false,
        fallasCardiacas: false,
        desmayos: false,
        tobillosHinchados: false,
        moretonesAnormales: false,
        presionAlta: false,
        heridasPecho: false,
        otrasEnfermedades: false,
        tomaMedicina: false,

        // Detalles - Exámen médico
        pulsoReposo: "",
        pulsoReposoBp: "",
        pulso30flexiones: "",
        respiracionReposo: "",
        respiracion30flexiones: "",
        obstruccionNasal: "",
        formaPecho: "",
        expansionPecho: "",
        pulmones: "",
        corazon: "",
        enfermedadesCronicas: "",
        funcionPulmonar: "",
        fvc: "",
        fevl: "",
        otros: "",
        enForma: "",

        // Detalles - Rayos X
        fechaPlaca: "",
        pechoNormal: "",
        tbcRayosX: "",
        pneumoconiosis: "",
        clasificacionOit: "",
        filmNumeroPlaca: "",
        corazonRayosX: "",
        otrosCambios: "",
        examenSaliva: "",

        // Opiniones
        hallazgosAnormales: "",
        opinionClinica: "",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,

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
        handleRadioButtonBoolean,
        handleFocusNext,
        handleClear,
        handleChangeSimple,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "DireccionGeneralMineria" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // El médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);

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

    // ===== Impresión =====
    const handlePrint = () => {
        handlePrintDefault(() => {
            PrintHojaR(form.norden, token, tabla, datosFooter, selectedSede);
        });
    };

    const handleSave = () => {
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] xl:max-w-[80%] mx-auto">
            <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                <RegistroEstadoPill
                    tieneRegistro={form.tieneRegistro}
                    className={hayRegistroCargado ? "" : "invisible"}
                />
                {hayRegistroCargado && form.tieneRegistro && !edicionHabilitada && (
                    <button
                        type="button"
                        onClick={habilitarEdicion}
                        className="pointer-events-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Habilitar edición
                    </button>
                )}
            </div>

            {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
            <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <div className="w-full flex gap-x-3">
                    <InputTextOneLine
                        label="N° Orden"
                        name="norden"
                        value={form.norden}
                        onKeyUp={handleSearch}
                        onChange={handleChangeNumber}
                        disabled={nordenDisabled}
                        labelWidth="120px"
                        className="flex-1"
                    />
                    <SearchButton onClick={executeSearch} className="lg:hidden" />
                </div>
                <InputTextOneLine
                    label="Tipo de Examen"
                    name="tipoExamen"
                    disabled
                    value={form.tipoExamen}
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Fecha de Ingreso"
                    name="fechaExamen"
                    type="date"
                    value={form.fechaExamen}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("fechaExamen")}
                    onRevert={() => revertField("fechaExamen")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: DATOS LABORALES ===== */}
            <DatosPersonalesLaborales form={form} />

            {/* ===== SECCIÓN: EXÁMEN MÉDICO ===== */}
            <SectionFieldset legend="Exámen Médico (Debe ser llenado por el médico que hace la evaluación física)" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                <InputTextOneLine
                    label="Fecha de Nacimiento"
                    name="fechaNacimientoPaciente"
                    value={form.fechaNacimientoPaciente}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Peso"
                    name="peso"
                    value={form.peso}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Talla"
                    name="talla"
                    value={form.talla}
                    disabled
                    labelWidth="120px"
                />
                <InputTextOneLine
                    label="Color de Piel"
                    name="colorPiel"
                    value={form.colorPiel}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("colorPiel")}
                    onRevert={() => revertField("colorPiel")}
                />
                <InputTextOneLine
                    label="Color de Ojos"
                    name="colorOjos"
                    value={form.colorOjos}
                    onChange={handleChange}
                    onKeyUp={handleFocusNext}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("colorOjos")}
                    onRevert={() => revertField("colorOjos")}
                />
                <InputTextOneLine
                    label="Cabello"
                    name="cabello"
                    value={form.cabello}
                    onChange={handleChange}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("cabello")}
                    onRevert={() => revertField("cabello")}
                />
            </SectionFieldset>

            <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
                <SectionFieldset legend="Factores Hereditarios">
                    <RadioTable
                        items={FACTORES_HEREDITARIOS_1}
                        options={OPCIONES_SI_NO}
                        form={form}
                        groupLabel="T.B.C."
                        handleRadioButton={handleRadioButtonBoolean}
                        disabled={camposDeshabilitados}
                    />
                </SectionFieldset>
                <SectionFieldset legend="Cáncer Pulmonar">
                    <RadioTable
                        items={FACTORES_HEREDITARIOS_2}
                        options={OPCIONES_SI_NO}
                        form={form}
                        groupLabel="CANCER PULMONAR"
                        handleRadioButton={handleRadioButtonBoolean}
                        disabled={camposDeshabilitados}
                    />
                </SectionFieldset>
            </div>

            {/* ===== SECCIÓN: DETALLES ===== */}
            <SectionFieldset legend="Detalles" className="grid grid-cols-1 gap-x-4 gap-y-3">
                <SectionFieldset legend="Exámen Médico" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fecha"
                            name="fechaExamenDetalle"
                            value={form.fechaExamen}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pulso en Reposo"
                            name="pulsoReposo"
                            value={form.pulsoReposo}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("pulsoReposo")}
                            onRevert={() => revertField("pulsoReposo")}
                        />
                        <InputTextOneLine
                            label="B.P."
                            name="pulsoReposoBp"
                            value={form.pulsoReposoBp}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("pulsoReposoBp")}
                            onRevert={() => revertField("pulsoReposoBp")}
                        />
                        <InputTextOneLine
                            label="Despues de 30 flexiones en 60 seg"
                            name="pulso30flexiones"
                            value={form.pulso30flexiones}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("pulso30flexiones")}
                            onRevert={() => revertField("pulso30flexiones")}
                        />
                        <InputTextOneLine
                            label="Respiracion en reposo"
                            name="respiracionReposo"
                            value={form.respiracionReposo}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("respiracionReposo")}
                            onRevert={() => revertField("respiracionReposo")}
                        />
                        <InputTextOneLine
                            label="Despues de 30 flexiones en 60 seg"
                            name="respiracion30flexiones"
                            value={form.respiracion30flexiones}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("respiracion30flexiones")}
                            onRevert={() => revertField("respiracion30flexiones")}
                        />
                        <InputsBooleanRadioGroup
                            label="Obstruccion Nasal"
                            name="obstruccionNasal"
                            labelWidth="120px"
                            value={form.obstruccionNasal}
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            trueLabel="Si"
                            falseLabel="No"
                            edited={isFieldEdited("obstruccionNasal")}
                            onRevert={() => revertField("obstruccionNasal")}
                        />
                        <InputTextOneLine
                            label="Forma del pecho"
                            name="formaPecho"
                            value={form.formaPecho}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("formaPecho")}
                            onRevert={() => revertField("formaPecho")}
                        />
                        <InputTextOneLine
                            label="Expansión del pecho Normal"
                            name="expansionPecho"
                            value={form.expansionPecho}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("expansionPecho")}
                            onRevert={() => revertField("expansionPecho")}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Pulmones"
                            name="pulmones"
                            value={form.pulmones}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="corazon"
                            value={form.corazon}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Enfermedades Cronicas"
                            name="enfermedadesCronicas"
                            value={form.enfermedadesCronicas}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("enfermedadesCronicas")}
                            onRevert={() => revertField("enfermedadesCronicas")}
                        />
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="Funcion Pulmonar"
                                name="funcionPulmonar"
                                value={form.funcionPulmonar}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="FVC"
                                name="fvc"
                                value={form.fvc}
                                disabled
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputTextOneLine
                                label="FEVL"
                                name="fevl"
                                value={form.fevl}
                                disabled
                                labelWidth="120px"
                            />
                            <InputTextOneLine
                                label="Otros"
                                name="otros"
                                value={form.otros}
                                disabled
                                labelWidth="120px"
                            />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-3">
                            <InputsBooleanRadioGroup
                                label="En Forma"
                                name="enForma"
                                labelWidth="120px"
                                value={form.enForma}
                                onChange={handleRadioButtonBoolean}
                                disabled={camposDeshabilitados}
                                trueLabel="Si"
                                falseLabel="No"
                                edited={isFieldEdited("enForma")}
                                onRevert={() => revertField("enForma")}
                            />
                        </div>
                    </div>
                </SectionFieldset>

                <SectionFieldset legend="Rayos X" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fecha"
                            name="fechaPlaca"
                            value={form.fechaPlaca}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Pecho Normal"
                            name="pechoNormal"
                            value={form.pechoNormal}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("pechoNormal")}
                            onRevert={() => revertField("pechoNormal")}
                        />
                        <InputTextOneLine
                            label="T.B.C."
                            name="tbcRayosX"
                            value={form.tbcRayosX}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("tbcRayosX")}
                            onRevert={() => revertField("tbcRayosX")}
                        />
                        <InputTextOneLine
                            label="Pneumoconiosis"
                            name="pneumoconiosis"
                            value={form.pneumoconiosis}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("pneumoconiosis")}
                            onRevert={() => revertField("pneumoconiosis")}
                        />
                        <InputTextOneLine
                            label="Clasificacion de la OIT (1980)"
                            name="clasificacionOit"
                            value={form.clasificacionOit}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("clasificacionOit")}
                            onRevert={() => revertField("clasificacionOit")}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Fllm N° de la placa"
                            name="filmNumeroPlaca"
                            value={form.filmNumeroPlaca}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Corazon"
                            name="corazonRayosX"
                            value={form.corazonRayosX}
                            onChange={handleChange}
                            onKeyUp={handleFocusNext}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("corazonRayosX")}
                            onRevert={() => revertField("corazonRayosX")}
                        />
                        <InputTextOneLine
                            label="Otros Cambios"
                            name="otrosCambios"
                            value={form.otrosCambios}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="120px"
                            edited={isFieldEdited("otrosCambios")}
                            onRevert={() => revertField("otrosCambios")}
                        />
                        <InputTextOneLine
                            label="Examen de Saliva"
                            name="examenSaliva"
                            value={form.examenSaliva}
                            disabled
                            labelWidth="120px"
                        />
                    </div>
                </SectionFieldset>
            </SectionFieldset>

            {/* ===== SECCIÓN: OPINIONES ===== */}
            <SectionFieldset legend="Opiniones" className="grid grid-cols-1 gap-x-4 gap-y-3">
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                    <InputTextOneLine
                        label="Pecho Normal"
                        name="pechoNormal"
                        value={form.pechoNormal}
                        labelWidth="120px"
                        disabled
                    />
                    <InputTextOneLine
                        label="Hallazgos Anormales"
                        name="hallazgosAnormales"
                        value={form.hallazgosAnormales}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        labelWidth="120px"
                        edited={isFieldEdited("hallazgosAnormales")}
                        onRevert={() => revertField("hallazgosAnormales")}
                    />
                    <InputTextOneLine
                        label="Clasificacion de la OIT (1980)"
                        name="clasificacionOit"
                        value={form.clasificacionOit}
                        onChange={handleChange}
                        onKeyUp={handleFocusNext}
                        disabled={camposDeshabilitados}
                        labelWidth="120px"
                        edited={isFieldEdited("clasificacionOit")}
                        onRevert={() => revertField("clasificacionOit")}
                    />
                </div>

                <InputTextArea
                    label="OPINION CLINICA (solo si difiere del examen medico)"
                    name="opinionClinica"
                    rows={2}
                    onChange={handleChange}
                    value={form.opinionClinica}
                    disabled={camposDeshabilitados}
                    labelWidth="120px"
                    edited={isFieldEdited("opinionClinica")}
                    onRevert={() => revertField("opinionClinica")}
                />
            </SectionFieldset>

            {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
            <SectionFieldset legend="Asignación de Médico" className="w-full">
                <EmpleadoComboBox
                    value={form.nombre_medico}
                    label="Especialista"
                    form={form}
                    onChange={handleChangeSimple}
                    disabled={camposDeshabilitados}
                    edited={isMedicoEdited}
                    onRevert={revertMedico}
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
    )
}

export default DireccionGeneralMineria
