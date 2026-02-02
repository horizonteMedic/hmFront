import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faQuestionCircle,
    faStethoscope,
    faBrain,
    faBroom,
    faPrint,
    faSave,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
    InputCheckbox,
    SectionFieldset,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { getToday, getTodayPlusOneYear } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import Antecedentes from "./TabsCertificadoAlturaPoderosa/Antecedentes";
import TestDeCage from "./TabsCertificadoAlturaPoderosa/TestDeCage";
import ExamenFisico from "./TabsCertificadoAlturaPoderosa/ExamenFisico";
import Neurologico from "./TabsCertificadoAlturaPoderosa/Neurologico";
import Swal from "sweetalert2";
import { PrintHojaR, SubmitDataService, VerifyTR, handleSubirArchivo, ReadArchivosForm, handleSubirArchivoMasivo } from "./controllerCertificadoAlturaPoderosa";
import EmpleadoComboBox from "../../../../../components/reusableComponents/EmpleadoComboBox";
import ButtonsPDF from "../../../../../components/reusableComponents/ButtonsPDF";

const tabla = "certificado_altura_poderosa";

export default function CertificadoAlturaPoderosa() {
    const today = getToday();
    const [activeTab, setActiveTab] = useState(0);
    const [visualerOpen, setVisualerOpen] = useState(null)

    const { token, userlogued, selectedSede, datosFooter, userName, userDNI } =
        useSessionData();

    const initialFormState = {
        // Header - Campos principales
        norden: "",
        codigoCertificado: null,
        fechaExam: today,
        nombreExamen: "",
        fechaHasta: getTodayPlusOneYear(),
        esApto: undefined,

        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        empresa: "",
        contrata: "",
        cargo: "",
        areaTrabajo: "",

        // Datos extra
        tiempoExperiencia: "",
        lugarTrabajo: "",
        altura: "",

        // ====================== TAB LATERAL: AGUDEZA VISUAL ======================
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
        // Historial
        accidentesTrabajoEnfermedades: "NIEGO ACCIDENTES DE TRABAJO",
        antecedentesFamiliares: "NIEGO",

        // Antecedentes Psiconeuroológicos
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

        // Consumo de sustancias
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

        // Médico
        nombre_medico: userName,
        dni_medico: userDNI,

        // ====================== TEST DE CAGE ======================
        // Preguntas del test CAGE
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

        // Anamnesis Test de Cage
        anamnesisTestDeCage: "REFIERE NO TENER MOLESTIA ALGUNA.",

        // ====================== EXAMEN FISICO ======================
        // Perímetros
        perimetroCadera: "",
        perimetroCuello: "",
        perimetroCintura: "",

        // Medidas corporales
        talla: "",
        peso: "",
        imc: "",

        // Medidas Extra
        fc: "",
        fr: "",
        pa: "",
        icc: "",
        pToracicoInspiracion: "",
        pToracicoEspiracion: "",

        // Examen físico detallado
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
        // Reflejos
        reflejos: "CONSERVADOS",

        // Pruebas neurológicas
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
        nomenclatura: "PSICOSENSOMETRICO ALTU-POD",

        // Médico que Certifica //BUSCADOR
        nombre_medico: userName,
        user_medicoFirma: userlogued,
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
    } = useForm(initialFormState, { storageKey: "CertificadoAlturaPoderosa" });

    const tabs = [
        { id: 0, name: "Antecedentes", icon: faClipboardList, component: Antecedentes },
        { id: 1, name: "Test de CAGE", icon: faQuestionCircle, component: TestDeCage },
        { id: 2, name: "Examen Físico", icon: faStethoscope, component: ExamenFisico },
        { id: 3, name: "Neurológico", icon: faBrain, component: Neurologico },
    ];

    const handleSave = () => {
        if (form.esApto == undefined) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, seleccione la aptitud.",
            })
            return
        }
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

    const recomendacionesTextMap = {
        sobrepesoObesidadHipocalorica: "SOBREPESO. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        corregirAgudezaVisual: "CORREGIR AGUDEZA VISUAL.",
        corregirAgudezaVisualTotal: "CORREGIR AGUDEZA VISUAL TOTAL.",
        obesidadDietaHipocalorica: "OBESIDAD I. BAJAR DE PESO. DIETA HIPOCALÓRICA Y EJERCICIOS.",
        usoLentesCorrectoresLecturaCerca: "USO DE LENTES CORRECTORES PARA LECTURA DE CERCA.",
        corregirAgudezaLecturaCerca: "CORREGIR AGUDEZA VISUAL PARA LECTURA DE CERCA.",
    };

    const handleCheckboxRecomendaciones = (e) => {
        handleCheckBoxWriteOnText(e, "conclusionesRecomendaciones", recomendacionesTextMap);
    }

    const ActiveComponent = tabs[activeTab]?.component || (() => null);

    return (
        <div className="mx-auto bg-white">
            <div className="flex h-full">
                {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
                            />
                            <InputTextOneLine
                                label="Nombre Examen"
                                name="nombreExamen"
                                value={form?.nombreExamen}
                                disabled
                            />
                            <InputTextOneLine
                                label="Fecha Examen "
                                name="fechaExam"
                                type="date"
                                value={form?.fechaExam}
                                onChange={handleChangeSimple}
                            />
                            <InputTextOneLine
                                label="Hasta"
                                name="fechaHasta"
                                type="date"
                                value={form?.fechaHasta}
                                onChange={handleChangeSimple}
                            />
                            <InputsBooleanRadioGroup
                                label="Aptitud"
                                name="esApto"
                                value={form.esApto}
                                trueLabel="APTO"
                                falseLabel="NO APTO"
                                onChange={handleRadioButtonBoolean}
                            />
                            <ButtonsPDF
                                {...form.SubirDoc ? { handleSave: () => { handleSubirArchivo(form, selectedSede, userlogued, token) } } : {}}
                                {...form.SubirDoc ? { handleRead: () => { ReadArchivosForm(form, setVisualerOpen, token) } } : {}}
                                handleMasivo={() => { handleSubirArchivoMasivo(form, selectedSede, userlogued, token) }}
                            />
                        </section>

                        {/* Información del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 gap-4">
                            <h3 className="font-bold mb-3">Datos del Paciente</h3>
                            {/* Fila 1: Nombres, DNI, Edad, Género */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <InputTextOneLine
                                    label="Nombres y Apellidos"
                                    name="nombres"
                                    value={form?.nombres}
                                    disabled
                                    labelWidth="60px"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                                    <InputTextOneLine
                                        label="DNI"
                                        name="dni"
                                        value={form?.dni}
                                        disabled
                                        labelWidth="60px"
                                    />
                                    <InputTextOneLine
                                        label="Sexo"
                                        name="sexo"
                                        value={form?.sexo}
                                        disabled
                                        labelWidth="60px"
                                    />
                                    <InputTextOneLine
                                        label="Edad"
                                        name="edad"
                                        value={form?.edad}
                                        disabled
                                        labelWidth="60px"
                                    />
                                </div>
                                <InputTextOneLine
                                    label="Área Trabajo"
                                    name="areaTrabajo"
                                    value={form?.areaTrabajo}
                                    disabled
                                    labelWidth="60px"
                                />
                                <InputTextOneLine
                                    label="Cargo"
                                    name="cargo"
                                    value={form?.cargo}
                                    disabled
                                    labelWidth="60px"
                                />
                                <InputTextOneLine
                                    label="Empresa"
                                    name="empresa"
                                    value={form?.empresa}
                                    disabled
                                    labelWidth="60px"
                                />
                                <InputTextOneLine
                                    label="Contrata"
                                    name="contrata"
                                    value={form?.contrata}
                                    disabled
                                    labelWidth="60px"
                                />
                            </div>
                        </section>
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 gap-4">
                            <h3 className="font-bold mb-3">Datos extra</h3>
                            {/* Fila 1: Nombres, DNI, Edad, Género */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <InputTextOneLine
                                    label="Tiempo de Experiencia"
                                    name="tiempoExperiencia"
                                    value={form?.tiempoExperiencia}
                                    onChange={handleChange}
                                    labelWidth="64px"
                                />
                                <InputTextOneLine
                                    label="Lugar de Trabajo"
                                    name="lugarTrabajo"
                                    value={form?.lugarTrabajo}
                                    onChange={handleChange}
                                    labelWidth="60px"
                                />
                                <InputTextOneLine
                                    label="Altura"
                                    name="altura"
                                    value={form?.altura}
                                    onChange={handleChange}
                                    labelWidth="60px"
                                />
                            </div>
                        </section>
                        {/* Navegación de pestañas */}
                        <nav className="flex bg-white border-b border-gray-200 sticky top-0 z-20">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
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

                        {/* Contenido de la pestaña activa */}
                        <div className="px-4 pt-4">
                            <ActiveComponent
                                form={form}
                                setForm={setForm}
                                handleChange={handleChange}
                                handleChangeNumber={handleChangeNumber}
                                handleCheckBoxChange={handleCheckBoxChange}
                                handleRadioButtonBoolean={handleRadioButtonBoolean}
                                handleClear={handleClear}
                                handleSave={handleSave}
                                handlePrint={handlePrint}
                                handleRadioButton={handleRadioButton}
                                handleChangeSimple={handleChangeSimple}
                            />
                        </div>
                        {/* Conclusiones Finales */}
                        <fieldset className="bg-white border border-gray-200 rounded-lg p-4 mx-4 mt-4">
                            <legend className="font-bold mb-2 text-gray-800 text-[10px]">
                                Conclusiones Finales
                            </legend>
                            <InputTextArea
                                label="Diagnóstico"
                                name="diagnostico"
                                value={form?.diagnostico}
                                onChange={handleChange}
                                rows={4}
                            />
                            <div className="mb-4 gap-4 grid md:grid-cols-3 mt-3">
                                <InputTextArea
                                    label="Conclusiones y Recomendaciones"
                                    name="conclusionesRecomendaciones"
                                    value={form?.conclusionesRecomendaciones}
                                    onChange={handleChange}
                                    className="col-span-2"
                                    rows={4}
                                />
                                {/* Recomendaciones específicas */}
                                <div className="grid grid-cols-1 gap-2">
                                    <InputCheckbox
                                        label="Sobrepeso/Obesidad - Dieta Hipocalórica"
                                        name="sobrepesoObesidadHipocalorica"
                                        checked={form?.sobrepesoObesidadHipocalorica}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                    <InputCheckbox
                                        label="Corregir Agudeza Visual"
                                        name="corregirAgudezaVisual"
                                        checked={form?.corregirAgudezaVisual}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                    <InputCheckbox
                                        label="Corregir Agudeza Visual Total"
                                        name="corregirAgudezaVisualTotal"
                                        checked={form?.corregirAgudezaVisualTotal}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                    <InputCheckbox
                                        label="Obesidad - Dieta Hipocalórica"
                                        name="obesidadDietaHipocalorica"
                                        checked={form?.obesidadDietaHipocalorica}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                    <InputCheckbox
                                        label="Uso de Lentes Correctores para Lectura de Cerca"
                                        name="usoLentesCorrectoresLecturaCerca"
                                        checked={form?.usoLentesCorrectoresLecturaCerca}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                    <InputCheckbox
                                        label="Corregir Agudeza para Lectura de Cerca"
                                        name="corregirAgudezaLecturaCerca"
                                        checked={form?.corregirAgudezaLecturaCerca}
                                        onChange={handleCheckboxRecomendaciones}
                                    />
                                </div>
                            </div>

                            {/* Médico */}
                            <SectionFieldset legend="Asignación de Médico">
                                <EmpleadoComboBox
                                    value={form.nombre_medico}
                                    label="Especialista"
                                    form={form}
                                    onChange={handleChangeSimple}
                                />
                            </SectionFieldset>
                        </fieldset>

                        <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-4">
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
                                <span className="font-bold italic text-base mb-1">Imprimir</span>
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
                    </div>
                </div>

                {/* Panel lateral - 20% */}
                <div className="w-1/5">
                    <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3 text-center">Sin Corregir</h4>
                        {/* Sin Corregir */}
                        <div className="mb-4">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="vcOD" value={form?.vcOD} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOD" value={form?.vlOD} disabled labelWidth="35px" />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <div className="space-y-3">
                                        <InputTextOneLine label="V.C." name="vcOI" value={form?.vcOI} disabled labelWidth="35px" />
                                        <InputTextOneLine label="V.L." name="vlOI" value={form?.vlOI} disabled labelWidth="35px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corregida */}
                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2 text-center">Corregida</h5>
                            {/* Fila OD y OI */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.D</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOD"
                                        value={form?.vcCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOD"
                                        value={form?.vlCorregidaOD}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="font-semibold mb-2 text-center">O.I</div>
                                    <InputTextOneLine
                                        label="V.C."
                                        name="vcCorregidaOI"
                                        value={form?.vcCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                    <InputTextOneLine
                                        label="V.L."
                                        name="vlCorregidaOI"
                                        value={form?.vlCorregidaOI}
                                        disabled
                                        labelWidth="35px"
                                    />
                                </div>
                            </div>
                            {/* Fila extra (ancho completo) */}
                            <div className="mt-4 space-y-3">
                                <InputTextOneLine
                                    label="V.Clrs"
                                    name="vclrs"
                                    value={form?.vclrs}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    name="vb"
                                    label="V.B."
                                    value={form?.vb}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextOneLine
                                    label="R.P."
                                    name="rp"
                                    value={form?.rp}
                                    disabled
                                    className="flex-1 w-full"
                                    labelWidth="35px"
                                />
                                <InputTextArea
                                    label="Enfermedades Oculares"
                                    rows={10}
                                    name="enfermedadesOculares"
                                    value={form?.enfermedadesOculares}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
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