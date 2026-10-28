import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faStethoscope,
    faChartLine,
    faDownload,
    faCarSide,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsRadioGroup,
    InputCheckbox,
    CIE10List,
    InputTextAreaUpper,
    SectionFieldset,
    SearchButton,
} from "../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../hooks/useForm";
import { useRegistroEditable } from "../../../../hooks/useRegistroEditable";
import ExamenMedico from "./ExamenMedico/ExamenMedico";
import Antecedentes from "./Antecedentes/Antecedentes";
import PruebasComplementarias from "./PruebasComplementarias/PruebasComplementarias";
import { getToday, getTodayPlusOneYear, getDatePlusYears, getFechaHoraActual } from "../../../../utils/helpers";
import { buildAuditoria } from "../../../../utils/auditoriaUtils";
import { useSessionData } from "../../../../hooks/useSessionData";
import Swal from "sweetalert2";
import { handleSubirArchivo, handleSubirArchivoMasivo, PrintHojaR, ReadArchivosForm, SubmitDataService, UpdateDataService, VerifyTR } from "./controllerFichaConduccionVehiculos";
import EmpleadoComboBox from "../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../components/reusableComponents/ButtonsPDF";
import RevertButton from "../../../../components/reusableComponents/RevertButton";
import AccionesRegistroHeader from "../../../../components/reusableComponents/AccionesRegistroHeader";
import AuditoriaRegistro from "../../../../components/reusableComponents/AuditoriaRegistro";
import DatosPersonalesLaborales from "../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../components/templates/BotonesForm";
import Boroo from "./Boroo/Boroo";

const tabla = "b_certificado_conduccion";

// Recomendaciones que se agregan/quitan del texto de observaciones al marcar su casilla.
const RECOMENDACIONES = [
    "sobrepesoDietaHipocalorica",
    "corregirAgudezaVisual",
    "corregirAgudezaVisualTotal",
    "obesidadDietaHipocalorica",
    "usoLentesCorrectoresLectura",
    "corregirAgudezaLectura",
];

// Campos que el usuario puede editar en este formulario (para resaltar/revertir cambios).
const CAMPOS_EDITABLES = [
    "fechaExam",
    "razonVisita",
    "experienciaAnios",
    // Examen médico
    "limitacionFuerzaExtremidades",
    "alteracionEquilibrioRomberg",
    "anormalidadMarchaOjosCerrados",
    "alteracionCoordinacionDedoNariz",
    "asimetriaFacial",
    "sustentacionUnPie",
    "presenciaNistagmus",
    "anormalidadMovimientosOculares",
    "pupilasNoCirla",
    "anormalidadLenguaje",
    "movimientosInvoluntarios",
    "detalleInformacionExamenMedico",
    // Antecedentes
    "alteracionConsciencia",
    "alcoholismoCronico",
    "movimientosInvoluntariosEnfermedades",
    "perdidaRecurrenteConsciencia",
    "diabetesHipoglicemiaNoControlada",
    "insuficienciaRenalCronicaGradoIV",
    "efectosEnfermedadTratamiento",
    "sustanciasEstupefacientesSinTratamiento",
    "sustanciasEstupefacientesConAlteracion",
    "sindromeApneaObstructivaSueño",
    "obesidadIMC30",
    "anemiaCriteriosOMS2011",
    "comentariosDetalleAntecedentes",
    // Pruebas complementarias
    "hipoacusiaFrecuenciasConversacionales",
    "alteracionAgudezaVisual",
    "noReconocimientoColores",
    "campimetriaAnormal",
    "pruebaVisionProfundidadAlterada",
    "testSASAnormal",
    "evaluacionPsicosensometricaAlterada",
    "medicinasTomando",
    "otrosDatosRelevancia",
    // Boroo
    "numeroDeLicencia",
    "claseLicencia",
    "fechaRevalidacionLicencia",
    "categoriaLicencia",
    "procedenciaLicencia",
    "maquina",
    "usoEstrictoLentesCorrectores",
    // Conclusión y comentarios
    "aptoDesde",
    "aptoHasta",
    "conclusion",
    "observacionesRecomendaciones",
    "conclusionesCie10",
    ...RECOMENDACIONES,
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function FichaConduccionVehiculos() {
    const today = getToday();
    const [activeTab, setActiveTab] = useState(0);

    const { token, userlogued, selectedSede, datosFooter, userCompleto, userName } =
        useSessionData();
    const initialFormState = {
        // Datos personales
        norden: "",
        codigoCertificado_cod_certificado: null,
        fechaExam: today,
        tipoExamen: "",
        razonVisita: "PRIMERA ACTITUD",
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        experienciaAnios: "",
        conclusionesCie10: "",

        empresa: "",
        contrata: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        estadoCivil: "",
        nivelEstudios: "",
        ocupacion: "",
        cargoDesempenar: "",
        //=====================TAB LATERAL=====================
        // Agudeza Visual
        vcOD: "",
        vlOD: "",
        vcOI: "",
        vlOI: "",

        vcCorregidaOD: "",
        vlCorregidaOD: "",
        vcCorregidaOI: "",
        vlCorregidaOI: "",

        vclrs: "",
        vb: "",
        rp: "",
        enfermedadesOculares: "",
        //=====================TAB EXAMEN MEDICO=====================
        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        presionArterial: "",
        talla: "",
        peso: "",
        imc: "",
        imcRed: false,
        perimetroCuello: "",
        perimetroCintura: "",
        perimetroCadera: "",
        icc: "",
        perimetroToracicoInspiracion: "",
        perimetroToracicoEspiracion: "",
        // Examen Médico - Hallazgos del Examen Físico
        limitacionFuerzaExtremidades: false,
        alteracionEquilibrioRomberg: false,
        anormalidadMarchaOjosCerrados: false,
        alteracionCoordinacionDedoNariz: false,
        asimetriaFacial: false,
        sustentacionUnPie: false,
        presenciaNistagmus: false,
        anormalidadMovimientosOculares: false,
        pupilasNoCirla: false,
        anormalidadLenguaje: false,
        movimientosInvoluntarios: false,
        // Examen Médico - Información Adicional
        detalleInformacionExamenMedico: "",

        //=====================TAB ANTECEDENTES=====================
        alteracionConsciencia: false,
        alcoholismoCronico: false,
        movimientosInvoluntariosEnfermedades: false,
        perdidaRecurrenteConsciencia: false,
        diabetesHipoglicemiaNoControlada: false,
        insuficienciaRenalCronicaGradoIV: false,
        // Antecedentes - Columna Derecha
        efectosEnfermedadTratamiento: false,
        sustanciasEstupefacientesSinTratamiento: false,
        sustanciasEstupefacientesConAlteracion: false,
        sindromeApneaObstructivaSueño: false,
        obesidadIMC30: false,
        anemiaCriteriosOMS2011: false,
        comentariosDetalleAntecedentes: "",

        //=====================TAB PRUEBAS COMPLEMENTARIAS=====================
        // Pruebas Complementarias
        hipoacusiaFrecuenciasConversacionales: false,
        alteracionAgudezaVisual: false,
        noReconocimientoColores: false,
        campimetriaAnormal: false,
        pruebaVisionProfundidadAlterada: false,
        testSASAnormal: false,
        evaluacionPsicosensometricaAlterada: false,
        // Otros Datos de Relevancia
        medicinasTomando: "",
        otrosDatosRelevancia: "",

        //=====================TAB BOROO=====================
        numeroDeLicencia: "",
        claseLicencia: "",
        fechaRevalidacionLicencia: today,
        categoriaLicencia: "",
        procedenciaLicencia: "",
        maquina: "",
        usoEstrictoLentesCorrectores: false,

        esBoroo: false,
        esNYV: false,

        //PARTE INFERIOR
        // Conclusión y Comentarios
        aptoDesde: today,
        aptoHasta: getTodayPlusOneYear(),
        conclusion: null,
        observacionesRecomendaciones: "",
        nombreMedicoColegiatura: userCompleto?.datos?.nombres_user?.toUpperCase() ?? "",
        dniUsuario: userCompleto?.datos?.dni_user ?? "",
        // Recomendaciones
        sobrepesoDietaHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLectura: false,
        corregirAgudezaLectura: false,

        // Médico que Certifica //BUSCADOR
        nombre_medico: "",
        user_medicoFirma: "",

        nombre_doctorAsignado: userName,
        user_doctorAsignado: userlogued,

        SubirDoc: false,
        nomenclatura: "PSICOSENSOMETRICO VEHI-FOLIO",

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
        handleRadioButton,
        handleClearnotO,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handlePrintDefault,
        handleCheckBoxChange,
        handleClear,
    } = useForm(initialFormState, { storageKey: "fichaConduccionVehiculos" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    // Cada médico se compone de 2 campos (id de firma + nombre): se detecta el cambio por
    // el id y se revierten ambos en conjunto.
    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
    const isDoctorAsignadoEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctorAsignado = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

    // Handler para cuando cambia aptoDesde: actualiza aptoHasta automáticamente
    const handleAptoDesdeChange = (e) => {
        const { name, value } = e.target;
        const yearsToAdd = (form.esBoroo || form.esNYV) ? 2 : 1;
        const newAptoHasta = getDatePlusYears(value, yearsToAdd);
        setForm(prev => ({
            ...prev,
            [name]: value,
            aptoHasta: newAptoHasta
        }));
    };

    // Mapeo de textos para Recomendaciones vinculadas a los checkboxes
    const recomendacionesTextMap = {
        sobrepesoDietaHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
        corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
        obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        usoLentesCorrectoresLectura: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
        corregirAgudezaLectura: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
    };

    // Handler para checkboxes de Recomendaciones: agrega/quita texto en observacionesRecomendaciones
    const handleRecomendacionCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: checked };
            // Obtenemos las líneas existentes
            const existentes = (prev.observacionesRecomendaciones || "")
                .split(/\n/)
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
            // Texto asociado al checkbox
            const texto = recomendacionesTextMap[name];
            let nuevasLineas = [...existentes];
            if (checked) {
                // Si se marca y aún no está, lo agregamos al final
                if (!nuevasLineas.includes(texto)) {
                    nuevasLineas.push(texto);
                }
            } else {
                // Si se desmarca, lo quitamos
                nuevasLineas = nuevasLineas.filter((l) => l !== texto);
            }
            const nuevoObs = nuevasLineas.join("\n");
            return { ...next, observacionesRecomendaciones: nuevoObs };
        });
    };

    // Las casillas de recomendaciones y el texto de observaciones van acoplados: se revierten juntos.
    const camposRecomendaciones = [...RECOMENDACIONES, "observacionesRecomendaciones", "conclusionesCie10"];

    const [visualerOpen, setVisualerOpen] = useState(null)

    const tabs = [
        {
            id: 0,
            name: "Examen Médico",
            icon: faStethoscope,
            component: ExamenMedico,
        },
        {
            id: 1,
            name: "Antecedentes",
            icon: faUser,
            component: Antecedentes,
        },
        {
            id: 2,
            name: "Pruebas Complementarias",
            icon: faChartLine,
            component: PruebasComplementarias,
        },
        {
            id: 3,
            name: "Boroo",
            icon: faCarSide,
            component: Boroo,
        },
    ];

    // Tras registrar o limpiar se vuelve a la primera pestaña.
    const limpiarTodo = () => { handleClear(); setActiveTab(0) };

    // La aptitud es obligatoria tanto al guardar como al editar.
    const aptitudSeleccionada = () => {
        if (form.conclusion == null) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, seleccione la aptitud.",
            })
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!aptitudSeleccionada()) return;
        SubmitDataService(form, token, userlogued, limpiarTodo, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!aptitudSeleccionada()) return;
        UpdateDataService(form, token, userlogued, limpiarTodo, tabla, datosFooter);
    };

    // ===== Búsqueda con boton =====
    const executeSearch = () => {
        handleClearnotO();
        setActiveTab(0);
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
            setActiveTab(0);
            setForm({ ...initialFormState, norden: value });
        } else {
            setForm((f) => ({ ...f, norden: value }));
        }
    };

    // ===== Impresión =====
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

    // Props comunes de un campo de texto de una sola línea.
    const campo = (name, onChange = handleChangeSimple) => ({
        name,
        value: form?.[name],
        onChange,
        disabled: camposDeshabilitados,
        edited: isFieldEdited(name),
        onRevert: () => revertField(name),
    });

    return (
        <div className="mx-auto bg-white space-y-3 px-4 pb-6">
            <AccionesRegistroHeader
                tieneRegistro={form.tieneRegistro}
                hayRegistroCargado={hayRegistroCargado}
                edicionHabilitada={edicionHabilitada}
                onHabilitarEdicion={habilitarEdicion}
                onLimpiar={limpiarTodo}
            />

            <div className="grid grid-cols-1 gap-3 items-start xl:grid-cols-[minmax(0,4fr)_minmax(0,1fr)]">
                {/* ===== CONTENIDO PRINCIPAL ===== */}
                <div className="space-y-3 min-w-0">
                    {/* ===== SECCIÓN: INFORMACIÓN DEL EXAMEN ===== */}
                    <SectionFieldset legend="Información del Examen" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex gap-x-3 w-full">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                                disabled={nordenDisabled}
                                labelWidth="110px"
                                className="w-full"
                            />
                            <SearchButton onClick={executeSearch} className="lg:hidden" />
                        </div>
                        <InputTextOneLine
                            label="Fecha Examen"
                            type="date"
                            labelWidth="110px"
                            {...campo("fechaExam")}
                        />
                        <InputTextOneLine
                            label="Tipo de Examen"
                            name="tipoExamen"
                            value={form?.tipoExamen}
                            disabled
                            labelWidth="110px"
                        />
                        <InputTextOneLine
                            label="T. Experiencia"
                            labelWidth="110px"
                            {...campo("experienciaAnios", handleChange)}
                        />
                        <InputsRadioGroup
                            name="razonVisita"
                            value={form?.razonVisita}
                            onChange={handleRadioButton}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("razonVisita")}
                            onRevert={() => revertField("razonVisita")}
                            options={[
                                { label: "1ra Actitud", value: "PRIMERA ACTITUD" },
                                { label: "Revalidación", value: "REVALIDACION" },
                            ]}
                        />
                    </SectionFieldset>

                    {/* ===== SECCIÓN: DATOS PERSONALES Y LABORALES ===== */}
                    <DatosPersonalesLaborales form={form} />

                    {/* ===== SECCIÓN: DOCUMENTO PSICOSENSOMÉTRICO ===== */}
                    <SectionFieldset legend="Documento Psicosensométrico">
                        <ButtonsPDF
                            {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                            {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                            handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                        />
                    </SectionFieldset>

                    {/* Tab Navigation */}
                    <nav className="flex overflow-x-auto bg-white border-b border-gray-200">
                        {tabs.map((tab) =>
                            tab.id != 3 || form.esBoroo || form.esNYV ? (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`flex-1 shrink-0 whitespace-nowrap px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                                        ? "border-[#233245] text-[#233245] font-semibold"
                                        : "border-transparent"
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                    {tab.name}
                                </button>
                            ) : null
                        )}
                    </nav>
                    {/* Tab Content */}
                    <div className="max-w-full">
                        {tabs.map((tab) => {
                            const Component = tab.component;
                            return (
                                activeTab === tab.id && (
                                    <Component
                                        key={tab.id}
                                        form={form}
                                        setForm={setForm}
                                        handleChange={handleChange}
                                        handleChangeNumber={handleChangeNumber}
                                        handleRadioButton={handleRadioButton}
                                        handleChangeSimple={handleChangeSimple}
                                        handleRadioButtonBoolean={handleRadioButtonBoolean}
                                        handleCheckBoxChange={handleCheckBoxChange}
                                        handleClear={limpiarTodo}
                                        disabled={camposDeshabilitados}
                                        isFieldEdited={isFieldEdited}
                                        revertField={revertField}
                                    />
                                )
                            );
                        })}
                    </div>

                    {/* ===== SECCIÓN: CONCLUSIÓN Y COMENTARIOS ===== */}
                    <SectionFieldset legend="Conclusión y Comentarios" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Izquierda - Conclusión */}
                        <div className="space-y-4">
                            <div>
                                <span className="block font-semibold mb-2">
                                    Apto para conducción de vehículos:
                                </span>
                                <div className="grid grid-cols-1 gap-2">
                                    <InputTextOneLine
                                        label="Desde"
                                        type="date"
                                        {...campo("aptoDesde", handleAptoDesdeChange)}
                                        onRevert={() => revertFields(["aptoDesde", "aptoHasta"])}
                                    />
                                    {/* La vigencia se calcula desde la fecha de inicio (1 año; 2 para Boroo y N&V) */}
                                    <InputTextOneLine
                                        label="Hasta"
                                        name="aptoHasta"
                                        type="date"
                                        value={form?.aptoHasta}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="block font-semibold mb-2">
                                    Conclusiones:
                                </span>
                                <InputsRadioGroup
                                    name="conclusion"
                                    value={form?.conclusion}
                                    onChange={handleRadioButton}
                                    disabled={camposDeshabilitados}
                                    edited={isFieldEdited("conclusion")}
                                    onRevert={() => revertField("conclusion")}
                                    vertical
                                    options={form?.esBoroo || form?.esNYV ? [
                                        { label: "Apto", value: "APTO" },
                                        { label: "No Apto", value: "NO APTO" },
                                    ] : [
                                        { label: "Apto", value: "APTO" },
                                        { label: "Observado", value: "OBSERVADO" },
                                        { label: "No Apto", value: "NO APTO" },
                                        { label: "Apto con Restricción", value: "APTO CON RESTRICCION" },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Columna Central - Observaciones */}
                        <div className="space-y-4">
                            <InputTextAreaUpper
                                label="Observaciones y Recomendaciones"
                                rows={6}
                                name="observacionesRecomendaciones"
                                value={form?.observacionesRecomendaciones}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("observacionesRecomendaciones")}
                                onRevert={() => revertFields(camposRecomendaciones)}
                                onChange={(upper) => {
                                    const cie10Lines = upper
                                        .split("\n")
                                        .filter(l => /^CIE 10:/i.test(l.trim()));
                                    const nuevoCie10 = cie10Lines.join("\n");
                                    setForm((d) => ({
                                        ...d,
                                        observacionesRecomendaciones: upper,
                                        ...(nuevoCie10 !== d.conclusionesCie10 && { conclusionesCie10: nuevoCie10 }),
                                    }));
                                }}
                            />
                            <div className="bg-green-200 p-3 rounded-xl">
                                <CIE10List
                                    value={form.conclusionesCie10}
                                    fieldName="conclusionesCie10"
                                    label="Conclusiones CIE10"
                                    token={token}
                                    setForm={setForm}
                                    setAdditionalForm={setForm}
                                    additionalFieldName="observacionesRecomendaciones"
                                    additionalDelimiter={"\n"}
                                    disabled={camposDeshabilitados}
                                />
                            </div>
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
                                edited={isDoctorAsignadoEdited}
                                onRevert={revertDoctorAsignado}
                            />
                        </div>

                        {/* Columna Derecha - Recomendaciones */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-gray-700">Recomendaciones:</h5>
                                {RECOMENDACIONES.some(isFieldEdited) && (
                                    <RevertButton
                                        onClick={() => revertFields(camposRecomendaciones)}
                                        title="Revertir recomendaciones y observaciones"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                {[
                                    ["sobrepesoDietaHipocalorica", "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."],
                                    ["corregirAgudezaVisual", "CORREGIR AGUDEZA VISUAL."],
                                    ["corregirAgudezaVisualTotal", "CORREGIR AGUDEZA VISUAL TOTAL."],
                                    ["obesidadDietaHipocalorica", "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS."],
                                    ["usoLentesCorrectoresLectura", "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA"],
                                    ["corregirAgudezaLectura", "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA."],
                                ].map(([name, label]) => (
                                    <InputCheckbox
                                        key={name}
                                        label={label}
                                        name={name}
                                        checked={form?.[name]}
                                        disabled={camposDeshabilitados}
                                        onChange={handleRecomendacionCheckboxChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </SectionFieldset>
                </div>

                {/* ===== PANEL LATERAL: AGUDEZA VISUAL (solo lectura: datos de Oftalmología) ===== */}
                <div className="space-y-3 min-w-0">
                    <SectionFieldset legend="Agudeza Visual - Sin Corregir" className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="font-semibold text-center">O.D</div>
                            <InputTextOneLine label="V.C." name="vcOD" value={form?.vcOD} disabled labelWidth="35px" />
                            <InputTextOneLine label="V.L." name="vlOD" value={form?.vlOD} disabled labelWidth="35px" />
                        </div>
                        <div className="space-y-3">
                            <div className="font-semibold text-center">O.I</div>
                            <InputTextOneLine label="V.C." name="vcOI" value={form?.vcOI} disabled labelWidth="35px" />
                            <InputTextOneLine label="V.L." name="vlOI" value={form?.vlOI} disabled labelWidth="35px" />
                        </div>
                    </SectionFieldset>

                    <SectionFieldset legend="Agudeza Visual - Corregida" className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="font-semibold text-center">O.D</div>
                                <InputTextOneLine label="V.C." name="vcCorregidaOD" value={form?.vcCorregidaOD} disabled labelWidth="35px" />
                                <InputTextOneLine label="V.L." name="vlCorregidaOD" value={form?.vlCorregidaOD} disabled labelWidth="35px" />
                            </div>
                            <div className="space-y-3">
                                <div className="font-semibold text-center">O.I</div>
                                <InputTextOneLine label="V.C." name="vcCorregidaOI" value={form?.vcCorregidaOI} disabled labelWidth="35px" />
                                <InputTextOneLine label="V.L." name="vlCorregidaOI" value={form?.vlCorregidaOI} disabled labelWidth="35px" />
                            </div>
                        </div>
                        <InputTextOneLine label="V.Clrs" name="vclrs" value={form?.vclrs} disabled labelWidth="45px" />
                        <InputTextOneLine label="V.B." name="vb" value={form?.vb} disabled labelWidth="45px" />
                        <InputTextOneLine label="R.P." name="rp" value={form?.rp} disabled labelWidth="45px" />
                    </SectionFieldset>

                    <SectionFieldset legend="Enfermedades Oculares">
                        <InputTextArea name="enfermedadesOculares" value={form?.enfermedadesOculares} rows={6} disabled />
                    </SectionFieldset>
                </div>
            </div>

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
                onNordenChange={handlePrintNordenChange}
                handleSave={form.tieneRegistro && edicionHabilitada ? handleEdit : handleSave}
                saveLabel={form.tieneRegistro && edicionHabilitada ? "Guardar Cambios" : "Guardar"}
                handleEdit={habilitarEdicion}
                handleClear={limpiarTodo}
                handlePrint={handlePrint}
                hideSave={form.tieneRegistro && !edicionHabilitada}
                hideEdit={!form.tieneRegistro || edicionHabilitada}
            />

            {visualerOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                        <div className="px-4 py-2 naranjabackgroud flex justify-between">
                            <h2 className="text-lg font-bold color-blanco">{visualerOpen.nombreArchivo}</h2>
                            <button onClick={() => setVisualerOpen(null)} className="text-xl text-white" style={{ fontSize: '23px' }}>×</button>
                        </div>
                        <div className="px-6 py-4  overflow-y-auto flex h-auto justify-center items-center">
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(`${visualerOpen.mensaje}`)}&embedded=true`} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                        </div>
                        <div className="flex justify-center">
                            <a href={visualerOpen.mensaje} download={visualerOpen.nombreArchivo} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                                <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
