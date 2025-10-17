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
} from "@fortawesome/free-solid-svg-icons";
import {
    InputTextOneLine,
    InputTextArea,
    InputsBooleanRadioGroup,
} from "../../../../../components/reusableComponents/ResusableComponents";
import { useForm } from "../../../../../hooks/useForm";
import { getToday } from "../../../../../utils/helpers";
import { useSessionData } from "../../../../../hooks/useSessionData";
import Antecedentes from "./TabsCertificadoAlturaPoderosa/Antecedentes";
import TestDeCage from "./TabsCertificadoAlturaPoderosa/TestDeCage";
import ExamenFisico from "./TabsCertificadoAlturaPoderosa/ExamenFisico";
import Neurologico from "./TabsCertificadoAlturaPoderosa/Neurologico";

const tabla = "";
const today = getToday();

export default function CertificadoAlturaPoderosa() {
    const [activeTab, setActiveTab] = useState(0);

    const { token, userlogued, selectedSede, datosFooter, userCompleto } =
        useSessionData();

    const initialFormState = {
        // Header
        norden: "",
        codigoCertificado: null,
        fechaExam: today,
        tipoExamen: "",

        // Datos personales
        nombres: "",
        dni: "",
        edad: "",
        sexo: "",
        empresa: "",
        contrata: "",
        cargo: "",
        altura: "",

        // Campos usados por la interfaz principal
        puestoPostula: "",
        puestoActual: "",

        dniUsuario: userCompleto?.datos?.dni_user ?? "",

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
        // Accidentes de Trabajo o Enfermedades Profesionales
        accidentesTrabajoEnfermedades: "Niego accidentes de trabajo",

        // Antecedentes Familiares
        antecedentesFamiliares: "Niego antecedentes familiares",

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
        alcohol: "",
        drogas: "NO",
        hojaCoca: "20 g",
        cafe: "1 taza",

        // Diagnóstico
        diagnostico: "",

        // Conclusiones y Recomendaciones
        apto: true,
        noApto: false,
        aptoConRestriccion: false,

        // Recomendaciones específicas
        sobrepesoObesidadHipocalorica: false,
        corregirAgudezaVisual: false,
        corregirAgudezaVisualTotal: false,
        obesidadDietaHipocalorica: false,
        usoLentesCorrectoresLecturaCerca: false,

        // Médico
        nombreApellidosMedico: "",
        nroColegiaturaDoctor: "",

        // Corrección de agudeza para lectura cerca
        corregirAgudezaLecturaCerca: false,

        // ====================== TEST DE CAGE ======================
        // Preguntas del test CAGE
        gustaDejarDivertirse: false,
        molestaTardaAlgunCompromiso: false,
        molestadoAlgunaVezGenteCriticaBeber: false,
        sentidoEstarReunionDivirtiendose: false,
        tenidoAlgunaVezImpresionDeberiaBeberMenos: false,
        quermeBien: false,
        sentidoAlgunaVezMalCulpableBeber: false,
        pondeNerviosoMenudo: false,
        algunaVezPrimeroHechoMananaBeberPara: false,
        sufreDolorEspaldaLevantarse: false,

        // ====================== EXAMEN FISICO ======================
        // Perímetros
        perimetroCadera: "",
        perimetroCuello: "",
        perimetroCintura: "",

        // Medidas corporales
        fc: "",
        fr: "",
        pa: "",
        talla: "",
        peso: "",
        imc: "",

        // Inspección General
        inspeccionGeneral: "ABEG, Despierto, OTEP",

        // Examen físico detallado
        cabeza: "Normocéfalo, central, móvil",
        piel: "Trigueño, turgente, hidratado",
        movilidadOcular: "Conservada",
        otoscopiaOD: "Normal",
        otoscopiaOI: "Normal",
        nariz: "Central, fosas nasales permeables",
        aparatoRespiratorio: "BPmv en ACP, ( no estertores)",

        // Aparato Cardiovascular
        aparatoCardiovascular: "RCRR, no soplos",
        abdomen: "Plano, RHA(+), B.D, No doloroso",
        musculoEsqueletico: "Motricidad conservada",
        columna: "Curvaturas conservadas",

        // Test de Epworth
        testEpworth: "",
        otrosExaLaboratorio: "",

        // ====================== NEUROLOGICO ======================
        // Reflejos
        reflejosConservados: false,

        // Pruebas específicas
        pruebas: "",
        dedoNariz: "",
        indiceBanany: "",
        disdiadococinesia: "",
        rombergSimple: "",
        rombergSensibilizado: "",
        marchaEnTandem: "",

        // Pruebas adicionales
        pruebasNegativo: false,
        pruebasPositivo: false,
        pruebasUntenberg: false,
        pruebasNegativoUntenberg: false,
        pruebasPositivoUntenberg: false,
        pruebasBabinski: false,
        pruebasDixHallpike: false,
        pruebasMarcha: false,
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
        handleClear,
        handleClearnotO,
        handlePrintDefault,
    } = useForm(initialFormState);

    const tabs = [
        { id: 0, name: "Antecedentes", icon: faClipboardList, component: Antecedentes },
        { id: 1, name: "Test de CAGE", icon: faQuestionCircle, component: TestDeCage },
        { id: 2, name: "Examen Físico", icon: faStethoscope, component: ExamenFisico },
        { id: 3, name: "Neurológico", icon: faBrain, component: Neurologico },
    ];

    const handleSave = () => {
        // Implementar lógica de guardado
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            handleClearnotO();
        }
    };

    const handlePrint = () => {
        handlePrintDefault(() => {
        });
    };

    const ActiveComponent = tabs[activeTab]?.component || (() => null);

    return (
        <div className="mx-auto bg-white">
            <div className="flex h-full">
                {/* Contenido principal - 80% */}
                <div className="w-4/5">
                    <div className="w-full">
                        {/* Datos del trabajador */}
                        <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <InputTextOneLine
                                label="N° Orden"
                                name="norden"
                                value={form?.norden}
                                onChange={handleChangeNumber}
                                onKeyUp={handleSearch}
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                        </section>
                    </div>
                </div>

                {/* Panel lateral - 20% */}
                <div className="w-1/5">
                    <section className="bg-white border border-gray-200 rounded-lg p-4 m-4 flex-1 flex flex-col space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3 text-center">Sin Corregir</h4>
                        {/* Sin Corregir */}
                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-3">
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
                            <div className="grid grid-cols-2 gap-6">
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
        </div>
    );
}