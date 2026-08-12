import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faQuestionCircle,
    faStethoscope,
    faBrain,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import InputTextArea from "../../../../../components/reusableComponents/InputTextArea";
import InputsBooleanRadioGroup from "../../../../../components/reusableComponents/InputsBooleanRadioGroup";
import InputCheckbox from "../../../../../components/reusableComponents/InputCheckbox";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SearchButton from "../../../../../components/reusableComponents/SearchButton";
import RegistroEstadoPill from "../../../../../components/reusableComponents/RegistroEstadoPill";
import AuditoriaRegistro from "../../../../../components/reusableComponents/AuditoriaRegistro";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";
import DatosPersonalesLaborales from "../../../../../components/templates/DatosPersonalesLaborales";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { useRegistroEditable } from "../../../../../hooks/useRegistroEditable";
import { getToday, getTodayPlusOneYear, getFechaHoraActual } from "../../../../../utils/helpers";
import { buildAuditoria } from "../../../../../utils/auditoriaUtils";
import Antecedentes from "./TabsCertificadoAlturaPoderosa/Antecedentes";
import TestDeCage from "./TabsCertificadoAlturaPoderosa/TestDeCage";
import ExamenFisico from "./TabsCertificadoAlturaPoderosa/ExamenFisico";
import Neurologico from "./TabsCertificadoAlturaPoderosa/Neurologico";
import {
    PrintHojaR,
    SubmitDataService,
    UpdateDataService,
    VerifyTR,
    handleSubirArchivo,
    ReadArchivosForm,
    handleSubirArchivoMasivo,
} from "./controllerCertificadoAlturaPoderosa";

const tabla = "certificado_altura_poderosa";
const today = getToday();

const TITULOS_EXAMEN = [
    "EXAMEN MÉDICO OCUPACIONAL PARA TRABAJOS EN ALTURA MAYOR A 1.8 METROS",
    "EXAMEN MÉDICO OCUPACIONAL PARA TRABAJOS EN ESPACIOS CONFINADOS",
];

// Cada checkbox agrega (o quita) su texto de "Conclusiones y Recomendaciones".
const RECOMENDACIONES_TEXT_MAP = {
    sobrepesoObesidadHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
    corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
    corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
    obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
    usoLentesCorrectoresLecturaCerca: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
    corregirAgudezaLecturaCerca: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
};

// Campos que el usuario puede editar en la sección principal (para resaltar/revertir cambios).
// El contenido de las pestañas (Antecedentes, Test de CAGE, Examen Físico, Neurológico) también
// respeta el bloqueo de edición, pero por su volumen no lleva resaltado/revertido individual.
const CAMPOS_EDITABLES = [
    "tituloExamen",
    "fechaExam",
    "fechaHasta",
    "esApto",
    "tiempoExperiencia",
    "lugarTrabajo",
    "altura",
    "diagnostico",
    "conclusionesRecomendaciones",
    "user_medicoFirma",
    "nombre_medico",
    "user_doctorAsignado",
    "nombre_doctorAsignado",
];

export default function CertificadoAlturaPoderosa() {
    const [activeTab, setActiveTab] = useState(0);
    const [visualerOpen, setVisualerOpen] = useState(null);

    const { token, userlogued, selectedSede, datosFooter, userName, userDNI, hora } = useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        tituloExamen: TITULOS_EXAMEN[0],
        codigoCertificado: null,
        fechaExam: today,
        nombreExamen: "",
        fechaHasta: getTodayPlusOneYear(),
        esApto: undefined,

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

        // Datos extra
        tiempoExperiencia: "",
        lugarTrabajo: "",
        altura: "",

        // ====================== AGUDEZA VISUAL (solo lectura) ======================
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

        // ====================== ANTECEDENTES ======================
        accidentesTrabajoEnfermedades: "NIEGO ACCIDENTES DE TRABAJO",
        antecedentesFamiliares: "NIEGO",

        tecModeradoGrave: false,
        tecModeradoGraveDescripcion: "",
        convulsiones: false,
        convulsionesDescripcion: "",
        mareosModosidadAcatisia: false,
        mareosModosidadAcatasiaDescripcion: "",
        problemasAudicion: false,
        problemasAudicionDescripcion: "",
        problemasEquilibrio: false,
        problemasEquilibrioDescripcion: "",
        acrofobia: false,
        acrofobiaDescripcion: "",
        agarofobia: false,
        agarofobiaDescripcion: "",

        tabaco: "",
        tabacoFrecuencia: "",
        alcohol: "CERVEZA",
        alcoholFrecuencia: "C/MES",
        drogas: "NO",
        drogasFrecuencia: "N/A",
        hojaCoca: "20 G",
        hojaCocaFrecuencia: "C/DÍA",
        cafe: "1 TAZA",
        cafeFrecuencia: "C/SEMANA",

        // Conclusiones Finales
        diagnostico: "",
        conclusionesRecomendaciones: "",

        // Recomendaciones específicas
        sobrepesoObesidadHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLecturaCerca: false,
        corregirAgudezaLecturaCerca: false,

        // ====================== TEST DE CAGE ======================
        gustaSalirDivertirse: false,
        gustaSalirDivertirsePuntaje: "",
        molestaLlegaTardeCompromiso: false,
        molestaLlegaTardeCompromisoPuntaje: "",
        molestadoGenteCriticaBeber: false,
        molestadoGenteCriticaBeberPuntaje: "",
        sentidoEstarReunionDivirtiendoseReanima: false,
        sentidoEstarReunionDivirtiendoseReanimaPuntaje: "",
        impresionDeberiaBeberMenos: false,
        impresionDeberiaBeberMenosPuntaje: "",
        duermeBien: false,
        duermeBienPuntaje: "",
        sentidoCulpablePorBeber: false,
        sentidoCulpablePorBeberPuntaje: "",
        poneNerviosoMenudo: false,
        poneNerviosoMenudoPuntaje: "",
        bebeMananaParaCalmarNervios: false,
        bebeMananaParaCalmarNerviosPuntaje: "",
        doloresEspaldaLevantarse: false,
        doloresEspaldaLevantarsePuntaje: "",
        anamnesisTestDeCage: "REFIERE NO TENER MOLESTIA ALGUNA.",

        // ====================== EXAMEN FISICO ======================
        perimetroCadera: "",
        perimetroCuello: "",
        perimetroCintura: "",
        talla: "",
        peso: "",
        imc: "",
        fc: "",
        fr: "",
        pa: "",
        icc: "",
        pToracicoInspiracion: "",
        pToracicoEspiracion: "",
        apreciacionGeneral: "ABEG, DESPIERTO, OTEP",
        cabeza: "NORMOCÉFALO, CENTRAL, MÓVIL",
        piel: "TRIGUEÑO, TURGENTE, HIDRATADO",
        movilidadOcular: "CONSERVADA",
        otoscopiaOD: "NORMAL",
        otoscopiaOI: "NORMAL",
        nariz: "CENTRAL, FOSAS NASALES PERMEABLES",
        aparatoRespiratorio: "BPMV EN ACP, ( NO ESTERTORES)",
        aparatoCardiovascular: "RCRR, NO SOPLOS",
        abdomen: "PLANO, RHA(+), B.D, NO DOLOROSO",
        musculoEsqueletico: "MOTRICIDAD CONSERVADA",
        columna: "CURVATURAS CONSERVADAS",
        testEpworth: "",
        otrosExaLaboratorio: "",

        // ====================== NEUROLOGICO ======================
        reflejos: "CONSERVADOS",
        pruebaDedoNariz: false,
        indiceBarany: false,
        diadococinesia: false,
        rombergSimple: false,
        rombergSensibilizado: false,
        marchaEnTandem: false,
        unterberg: false,
        babinskiWeil: false,
        dixHallpike: false,
        marcha: false,

        SubirDoc: false,

        // Subida de documento (psicosensométrico)
        nomenclatura: "PSICOSENSOMETRICO ALTU-POD",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
        dni_medico: userDNI,

        // Doctor Asignado
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
        handleChangeNumber,
        handleRadioButton,
        handleChangeSimple,
        handleRadioButtonBoolean,
        handleCheckBoxChange,
        handleCheckBoxWriteOnText,
        handleClear,
        handleClearnotO,
        handlePrintDefault,
        handleChangeNumberDecimals,
    } = useForm(initialFormState, { storageKey: "CertificadoAlturaPoderosa" });

    const {
        edicionHabilitada,
        habilitarEdicion,
        camposDeshabilitados,
        isFieldEdited,
        revertField,
        revertFields,
    } = useRegistroEditable(form, setForm, { tieneRegistro: form.tieneRegistro, camposEditables: CAMPOS_EDITABLES });

    const isMedicoEdited = isFieldEdited("user_medicoFirma");
    const revertMedico = () => revertFields(["user_medicoFirma", "nombre_medico"]);
    const isDoctorEdited = isFieldEdited("user_doctorAsignado");
    const revertDoctor = () => revertFields(["user_doctorAsignado", "nombre_doctorAsignado"]);

    const tabs = [
        { id: 0, name: "Antecedentes", icon: faClipboardList, component: Antecedentes },
        { id: 1, name: "Test de CAGE", icon: faQuestionCircle, component: TestDeCage },
        { id: 2, name: "Examen Físico", icon: faStethoscope, component: ExamenFisico },
        { id: 3, name: "Neurológico", icon: faBrain, component: Neurologico },
    ];
    const ActiveComponent = tabs[activeTab]?.component || (() => null);

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

    const validateForm = () => {
        if (form.esApto === undefined) {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-clipboard-list"></i>Error',
                html: "Por favor, seleccione la aptitud.",
            });
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        SubmitDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleEdit = () => {
        if (!validateForm()) return;
        UpdateDataService(form, token, userlogued, handleClear, tabla, datosFooter);
    };

    const handleCheckboxRecomendaciones = (e) => {
        handleCheckBoxWriteOnText(e, "conclusionesRecomendaciones", RECOMENDACIONES_TEXT_MAP);
    };

    const hayRegistroCargado = Boolean(form.nombres || form.dni);
    const nordenDisabled = hayRegistroCargado;

    const auditoria = buildAuditoria(form, {
        usuarioActual: userlogued,
        fechaHoraActual: getFechaHoraActual(),
    });

    return (
        <div className="space-y-3 px-4 max-w-[90%] mx-auto">
            {hayRegistroCargado && (
                <div className="sticky top-2 z-20 flex justify-end pointer-events-none">
                    <RegistroEstadoPill tieneRegistro={form.tieneRegistro} />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-3 items-start">
                {/* ===== COLUMNA PRINCIPAL ===== */}
                <div className="w-full flex-1 space-y-3">
                    {/* ===== SECCIÓN: INFORMACIÓN GENERAL ===== */}
                    <SectionFieldset legend="Información General" className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
                        <div className="w-full flex gap-x-3">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                                disabled={nordenDisabled}
                                labelWidth="120px"
                                className="flex-1"
                            />
                            <SearchButton onClick={executeSearch} className="lg:hidden" />
                        </div>
                        <InputTextOneLine
                            label="Nombre Examen"
                            name="nombreExamen"
                            value={form.nombreExamen}
                            disabled
                            labelWidth="120px"
                        />
                        <InputTextOneLine
                            label="Hora"
                            labelWidth="120px"
                            disabled
                            value={hora}
                            className="font-bold"
                        />
                        <div className="flex gap-4 items-center lg:col-span-2">
                            <h4 className="font-semibold min-w-[120px] max-w-[120px] text-primario">Título del Examen :</h4>
                            <select
                                name="tituloExamen"
                                value={form.tituloExamen}
                                onChange={handleChangeSimple}
                                disabled={camposDeshabilitados}
                                className="border rounded px-2 py-1 text-base w-full disabled:bg-gray-300"
                            >
                                {TITULOS_EXAMEN.map((titulo) => (
                                    <option key={titulo} value={titulo}>{titulo}</option>
                                ))}
                            </select>
                        </div>
                        <InputsBooleanRadioGroup
                            label="Aptitud"
                            name="esApto"
                            value={form.esApto}
                            trueLabel="APTO"
                            falseLabel="NO APTO"
                            onChange={handleRadioButtonBoolean}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("esApto")}
                            onRevert={() => revertField("esApto")}
                        />
                    </SectionFieldset>

                    {/* ===== SECCIÓN: DATOS LABORALES ===== */}
                    <DatosPersonalesLaborales form={form} />

                    <SectionFieldset legend="Datos Extra" className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        <InputTextOneLine
                            label="Tiempo de Experiencia"
                            name="tiempoExperiencia"
                            value={form.tiempoExperiencia}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="130px"
                            edited={isFieldEdited("tiempoExperiencia")}
                            onRevert={() => revertField("tiempoExperiencia")}
                        />
                        <InputTextOneLine
                            label="Lugar de Trabajo"
                            name="lugarTrabajo"
                            value={form.lugarTrabajo}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="130px"
                            edited={isFieldEdited("lugarTrabajo")}
                            onRevert={() => revertField("lugarTrabajo")}
                        />
                        <InputTextOneLine
                            label="Altura"
                            name="altura"
                            value={form.altura}
                            onChange={handleChange}
                            disabled={camposDeshabilitados}
                            labelWidth="130px"
                            edited={isFieldEdited("altura")}
                            onRevert={() => revertField("altura")}
                        />
                    </SectionFieldset>

                    {/* ===== SECCIÓN: SUBIDA MASIVA DE DOCUMENTOS ===== */}
                    <SectionFieldset legend="Documento Psicosensométrico"> 
                        <ButtonsPDF
                                {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                                {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                                handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                            />
                    </SectionFieldset>

                    {/* ===== PESTAÑAS: ANTECEDENTES / TEST DE CAGE / EXAMEN FÍSICO / NEUROLÓGICO ===== */}
                    <div className="bg-primarioClaro border rounded">
                        <nav className="flex bg-white border-b border-gray-200 rounded-t sticky top-0 z-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`flex-1 px-4 py-3 uppercase tracking-wider text-[11px] border-b-4 transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeTab === tab.id
                                        ? "border-[#233245] text-[#233245] font-semibold"
                                        : "border-transparent"
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                        <div className="p-4">
                            <ActiveComponent
                                form={form}
                                setForm={setForm}
                                handleChange={handleChange}
                                handleChangeNumber={handleChangeNumber}
                                handleCheckBoxChange={handleCheckBoxChange}
                                handleRadioButtonBoolean={handleRadioButtonBoolean}
                                handleRadioButton={handleRadioButton}
                                handleChangeSimple={handleChangeSimple}
                                disabled={camposDeshabilitados}
                            />
                        </div>
                    </div>

                    {/* ===== SECCIÓN: CONCLUSIONES FINALES ===== */}
                    <SectionFieldset legend="Conclusiones Finales" className="space-y-3">
                        <InputTextArea
                            label="Diagnóstico"
                            name="diagnostico"
                            value={form.diagnostico}
                            onChange={handleChange}
                            rows={4}
                            disabled={camposDeshabilitados}
                            edited={isFieldEdited("diagnostico")}
                            onRevert={() => revertField("diagnostico")}
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                            <InputTextArea
                                label="Conclusiones y Recomendaciones"
                                name="conclusionesRecomendaciones"
                                value={form.conclusionesRecomendaciones}
                                onChange={handleChange}
                                className="md:col-span-2"
                                rows={4}
                                disabled={camposDeshabilitados}
                                edited={isFieldEdited("conclusionesRecomendaciones")}
                                onRevert={() => revertField("conclusionesRecomendaciones")}
                            />
                            <div className="grid grid-cols-1 gap-2">
                                <InputCheckbox
                                    label="Sobrepeso/Obesidad - Dieta Hipocalórica"
                                    name="sobrepesoObesidadHipocalorica"
                                    checked={form.sobrepesoObesidadHipocalorica}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                                <InputCheckbox
                                    label="Corregir Agudeza Visual"
                                    name="corregirAgudezaVisual"
                                    checked={form.corregirAgudezaVisual}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                                <InputCheckbox
                                    label="Corregir Agudeza Visual Total"
                                    name="corregirAgudezaVisualTotal"
                                    checked={form.corregirAgudezaVisualTotal}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                                <InputCheckbox
                                    label="Obesidad - Dieta Hipocalórica"
                                    name="obesidadDietaHipocalorica"
                                    checked={form.obesidadDietaHipocalorica}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                                <InputCheckbox
                                    label="Uso de Lentes Correctores para Lectura de Cerca"
                                    name="usoLentesCorrectoresLecturaCerca"
                                    checked={form.usoLentesCorrectoresLecturaCerca}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                                <InputCheckbox
                                    label="Corregir Agudeza para Lectura de Cerca"
                                    name="corregirAgudezaLecturaCerca"
                                    checked={form.corregirAgudezaLecturaCerca}
                                    onChange={handleCheckboxRecomendaciones}
                                    disabled={camposDeshabilitados}
                                />
                            </div>
                        </div>
                    </SectionFieldset>

                    {/* ===== SECCIÓN: ASIGNACIÓN DE MÉDICO ===== */}
                    <SectionFieldset legend="Asignación de Médico" className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
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
                </div>

                {/* ===== BARRA LATERAL: AGUDEZA VISUAL (solo lectura, Triaje) ===== */}
                <aside className="w-full lg:w-96 shrink-0 space-y-3">
                    <SectionFieldset legend="Agudeza Visual">
                        <div className="space-y-4">
                            <div>
                                <div className="font-semibold mb-2 text-center text-sm">Sin Corregir</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.D</div>
                                        <InputTextOneLine label="V.C." name="vcOD" value={form.vcOD} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOD" value={form.vlOD} disabled labelWidth="35px" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.I</div>
                                        <InputTextOneLine label="V.C." name="vcOI" value={form.vcOI} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOI" value={form.vlOI} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold mb-2 text-center text-sm">Corregida</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.D</div>
                                        <InputTextOneLine label="V.C." name="vcCorregidaOD" value={form.vcCorregidaOD} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlCorregidaOD" value={form.vlCorregidaOD} disabled labelWidth="35px" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-semibold text-center text-xs">O.I</div>
                                        <InputTextOneLine label="V.C." name="vcCorregidaOI" value={form.vcCorregidaOI} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlCorregidaOI" value={form.vlCorregidaOI} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    <InputTextOneLine label="V.Clrs" name="vclrs" value={form.vclrs} disabled labelWidth="50px" />
                                    <InputTextOneLine label="V.B." name="vb" value={form.vb} disabled labelWidth="50px" />
                                    <InputTextOneLine label="R.P." name="rp" value={form.rp} disabled labelWidth="50px" />
                                </div>
                            </div>
                            <InputTextArea label="Enfermedades Oculares" name="enfermedadesOculares" rows={5} value={form.enfermedadesOculares} disabled />
                        </div>
                    </SectionFieldset>
                </aside>
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
